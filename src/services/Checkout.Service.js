const RepositoryFactory = require("../models/repositories/repositoryFactory");
const PaymentFactory = require("./payment/PaymentFactory");
const RedisService = require("./Redis.Service");
const EmailService = require("./Email.service");
const { retry } = require("../helpers/retryFuntion");
const { pushOrderToES, pushOrderDetailToES } = require("./elasticsearch/orderDetailES.service");
const GhnService = require("./shipping/GHNService");
const NotfiticationService = require("./Notification.service");

class CheckoutService {
    // 1. Lấy tất cả payment method cho FE
    static async getPaymentMethod() {
        await RepositoryFactory.initialize();
        const PaymentMethodRepo = RepositoryFactory.getRepository("PaymentMethodRepository");
        return await PaymentMethodRepo.getAllPaymentMethod();
    }

    static async checkout({ userId, selectedItems = [], addressId, paymentMethodId, source = null }) {
        await RepositoryFactory.initialize();
        const CartRepo = RepositoryFactory.getRepository("CartRepository");
        const ProductRepo = RepositoryFactory.getRepository("ProductRepository");
        const DiscountRepo = RepositoryFactory.getRepository("DiscountRepository");
        const PaymentMethodRepo = RepositoryFactory.getRepository("PaymentMethodRepository")
        if (!selectedItems.length) throw new Error("No products selected for checkout");
        if (!addressId) throw new Error("No address selected");
        if (!paymentMethodId) throw new Error("No payment method selected");

        let totalAmount = 0;
        const finalItems = [];
        const lockList = [];

        try {
            for (const item of selectedItems) {
                const { productId, skuNo, quantity, discountIds = [] } = item;

                // Nếu checkout từ cart thì kiểm tra lại giỏ
                let productInCart = null;
                if (source === 'cart' || source == null) {
                    productInCart = await CartRepo.findProductInCart(userId, productId, skuNo);
                    if (!productInCart || productInCart.quantity < quantity) {
                        throw new Error(`Invalid or insufficient cart quantity for product ${productId} | ${skuNo}`);
                    }
                }

                // Lấy thông tin sản phẩm
                const productSku = await ProductRepo.getProductWithSku(productId, skuNo);
                if (!productSku) throw new Error(`Product ${productId} | ${skuNo} not found in product repository`);

                // Check tồn kho
                const availableStock = productSku.sku_stock;
                const reservedQty = await RedisService.getReservedQuantity(productId, skuNo) || 0;
                if ((availableStock - reservedQty) < quantity) {
                    throw new Error(`Not enough stock for product ${productId} | ${skuNo}`);
                }

                // Lock sản phẩm
                const lock = await RedisService.acquireLock({
                    productID: productId,
                    skuNo: skuNo,
                    cartID: userId,
                    quantity,
                    timeout: 15,
                });
                if (!lock) throw new Error(`Product ${productId} is being checked out by another user.`);
                lockList.push(lock);

                // Giá & giảm giá
                const unitPrice = parseFloat(productSku.sku_price);
                let itemTotal = unitPrice * quantity;

                // Áp dụng discount sản phẩm
                let discountAmount = 0;
                let validDiscounts = [];
                if (discountIds.length > 0) {
                    validDiscounts = await DiscountRepo.validateDiscountsForProduct(productId, discountIds, itemTotal);
                    for (const d of validDiscounts) {
                        if (d.type === 'amount') discountAmount += d.value;
                        else if (d.type === 'percent') discountAmount += itemTotal * d.value / 100;
                    }
                }
                if (discountAmount > itemTotal) discountAmount = itemTotal;
                itemTotal -= discountAmount;
                if (itemTotal < 0) itemTotal = 0;

                totalAmount += itemTotal;

                finalItems.push({
                    ...item,
                    unitPrice,
                    itemTotal,
                    discountAmount,
                    validDiscounts,
                    ShopId: productSku.ShopId || productSku.shopId || null,
                    productName: productSku.product_name || productSku.name || "",
                    categoryId: productSku.categoryId || productSku.CategoryId || null
                });
            }

            // Payment Intent
            const paymentMethod = await PaymentMethodRepo.findPaymentMethodById(paymentIntentId)
            const paymentService = PaymentFactory.getPaymentService(paymentMethod.name);
            const paymentResult = await paymentService.createPayment({
                amount: Math.round(totalAmount),
                currency: "sgd",
                meta: { userId: String(userId), type: source || (selectedItems.length > 1 ? 'cart' : 'buynow') },
            });

            const paymentIntentId = paymentResult.paymentIntentId || `cod_${Date.now()}`;
            await RedisService.set(`checkout:${userId}:${paymentIntentId}`, {
                userId,
                items: finalItems,
                totalAmount,
                addressId,
                paymentMethodId,
                type: source || (selectedItems.length > 1 ? 'cart' : 'buynow'),
            }, 900);

            return {
                paymentIntentClientSecret: paymentResult.clientSecret,
                paymentIntentId,
                items: finalItems,
                totalAmount,
                addressId,
                paymentMethodId,
            };
        } catch (error) {
            for (const lock of lockList) await RedisService.releaseLock(lock);
            throw error;
        }
    }

    static async confirmPayment({ userId, paymentIntentId }) {
        await RepositoryFactory.initialize();
        const sequelize = RepositoryFactory.getSequelize();
        const OrderRepo = RepositoryFactory.getRepository("OrderRepository");
        const InventoryRepo = RepositoryFactory.getRepository("InventoryRepository");
        const NotificationRepo = RepositoryFactory.getRepository("NotificationRepository");
        const DiscountRepo = RepositoryFactory.getRepository("DiscountRepository");
        const PaymentRepo = RepositoryFactory.getRepository("PaymentRepository");
        const ProductRepo = RepositoryFactory.getRepository("ProductRepository");
        const CartRepo = RepositoryFactory.getRepository("CartRepository");
        const AddressRepo = RepositoryFactory.getRepository("AddressRepository");
        const PaymentMethodRepo = RepositoryFactory.getRepository("PaymentMethodRepository")
        const paymentMethod = await PaymentMethodRepo.findPaymentMethodById(paymentIntentId)

        // 1. Lấy checkout session
        const checkoutData = await RedisService.get(`checkout:${userId}:${paymentIntentId}`);
        if (!checkoutData) throw new Error("Checkout session expired or invalid");

        // 2. Xác thực payment
        const paymentService = PaymentFactory.getPaymentService(checkoutData.paymentMethod);
        const isPaid = await paymentService.verifyPayment(paymentIntentId);
        if (!isPaid) throw new Error("Payment not completed or invalid");

        let orderTotal = 0;
        const orderDetailsData = [];
        const lockReleaseQueue = [];
        const transaction = await sequelize.transaction();
        let createdOrder = null;

        try {
            // 3. Tạo đơn hàng SQL
            createdOrder = await OrderRepo.createOrder({
                UserId: userId,
                AddressId: checkoutData.addressId,
                TotalPrice: 0,
                Status: "paid",
                PaymentMethodId: checkoutData.paymentMethodId,
            }, { transaction });

            // 4. Tạo chi tiết đơn hàng + tổng hợp sản phẩm
            const esProducts = [];
            for (const item of checkoutData.items) {
                const { productId, skuNo, quantity, unitPrice, itemTotal, ShopId, productName, discountAmount, categoryId } = item;

                // Trừ kho, tăng sale
                await InventoryRepo.decrementStock({
                    skuNo,
                    ShopId: ShopId || null,
                    quantity,
                    transaction,
                });
                await ProductRepo.increaseSaleCount(productId, quantity);

                for (const d of (item.validDiscounts || [])) {
                    await DiscountRepo.incrementUserCounts(d.id);
                }

                orderTotal += itemTotal;
                orderDetailsData.push({
                    ProductId: productId,
                    ShopId: ShopId || null,
                    sku_no: skuNo,
                    quantity,
                    price_at_time: unitPrice,
                });

                esProducts.push({
                    productId,
                    productName,
                    quantity,
                    unitPrice,
                    discountAmount,
                    shopId: ShopId || null,
                    categoryId: categoryId || null,
                });

                // Nếu là cart thì xóa khỏi cart
                if (checkoutData.type === "cart") {
                    const cart = await CartRepo.getOrCreateCart(userId);
                    await CartRepo.removeItemsFromCart(cart.id, [{ productId, skuNo }]);
                }

                lockReleaseQueue.push({
                    key: `lock:product:${productId}:sku:${skuNo}:cart:${userId}`,
                    token: null,
                    productID: productId,
                    skuNo,
                    cartID: userId,
                });
            }

            // 5. Ghi chi tiết đơn hàng
            await OrderRepo.bulkCreateOrderDetails(createdOrder.id, orderDetailsData, { transaction });
            await OrderRepo.updateOrderTotal(createdOrder.id, orderTotal, { transaction });

            // 6. Lưu thông tin payment
            await PaymentRepo.create({
                UserId: userId,
                OrderId: createdOrder.id,
                TotalPrice: orderTotal,
                Status: "succeeded",
                PaymentMethodId: checkoutData.paymentMethodId,
            }, { transaction });

            // =========================
            // 7. Gọi GHN API Tạo vận đơn (GhnService.createOrder)
            // =========================
            let ghnOrderRes = null;
            try {
                // Lấy địa chỉ giao hàng
                const addressObj = await AddressRepo.findById(checkoutData.addressId);
                if (!addressObj) throw new Error("Không tìm thấy địa chỉ giao hàng!");

                // Lấy user info để gửi recipient
                const userInfo = await OrderRepo.getUserInfo(userId);

                // Tạo body chuẩn GHN (tham khảo docs GHN)
                const ghnOrderBody = {
                    payment_type_id: checkoutData.paymentMethod === "cod" ? 2 : 1, // 2: người nhận trả, 1: shop trả
                    note: "Giao nhanh giúp shop!",
                    required_note: "KHONGCHOXEMHANG", // "CHOTHUHANG" (cho thử hàng) nếu cần
                    from_name: "Tên Shop",
                    from_phone: "0123456789",
                    from_address: " số 101, đường Nguyễn Văn Trỗi",
                    from_ward_name: "Phương liệt",
                    from_district_name: "Thanh Xuân",
                    from_province_name: "Hà Nội",
                    to_name: userInfo.name,
                    to_phone: userInfo.phone || "0123456789",
                    to_address: addressObj.address,
                    to_ward_name: addressObj.ward || "",
                    to_district_name: addressObj.district || "",
                    to_province_name: addressObj.city,
                    cod_amount: checkoutData.paymentMethod === "cod" ? orderTotal : 0,
                    content: "ShopMan - Đơn hàng #" + createdOrder.id,
                    weight: 500, // gram, hoặc tổng khối lượng sản phẩm
                    length: 20, width: 10, height: 10, // cm
                    service_id: 53321, // lấy từ API GHN dịch vụ phù hợp (GHN Express, GHN Standard...)
                    items: checkoutData.items.map(item => ({
                        name: item.productName || "Sản phẩm",
                        code: item.skuNo,
                        quantity: item.quantity,
                        price: item.unitPrice,
                    })),
                };

                // Gọi GHN
                ghnOrderRes = await GhnService.createGhnOrder(ghnOrderBody);

                // Lưu tracking vào DB
                await OrderRepo.update(createdOrder.id, {
                    shippingProvider: "GHN",
                    shippingTrackingCode: ghnOrderRes.data.order_code,
                    shippingStatus: "WAITING_PICKUP"
                }, { transaction });

            } catch (e) {
                console.error("GHN API error:", e.message);
                // Có thể retry sau hoặc flag đơn hàng cho admin xử lý
            }

            await transaction.commit();

            // 8. Dual-write: Push lên ElasticSearch
            await pushOrderToES({
                orderId: createdOrder.id,
                userId,
                addressId: checkoutData.addressId,
                totalPrice: orderTotal,
                status: "paid",
                paymentMethodId: checkoutData.paymentMethodId,
                createdAt: createdOrder.createdAt,
                products: esProducts,
                shippingTrackingCode: ghnOrderRes?.data?.order_code || null,
                shippingProvider: "GHN",
            });

            for (const item of orderDetailsData) {
                await pushOrderDetailToES({
                    orderId: createdOrder.id,
                    productId: item.ProductId,
                    shopId: item.ShopId,
                    sku_no: item.sku_no,
                    quantity: item.quantity,
                    priceAtTime: item.price_at_time,
                    createdAt: new Date(),
                });
            }

            // Release lock, gửi email, notification...
            for (const lock of lockReleaseQueue) await RedisService.releaseLock(lock);
            retry(() =>
                NotificationRepo.create({
                    type: "order",
                    option: "success",
                    content: `Đơn hàng #${createdOrder.id} của bạn đã được thanh toán thành công`,
                    UserId: userId,
                    isRead: false,
                    meta: {
                        orderId: createdOrder.id,
                        link: `/order/details/${createdOrder.id}` // hoặc deep link cho app mobile nếu có
                    }
                })
            ).catch(console.error);


            // Email invoice
            const userInfo = await OrderRepo.getUserInfo(userId);
            const emailService = new EmailService(userInfo, null);
            retry(async () =>
                await emailService.sendInvoice("invoice", "Xác nhận đơn hàng ShopMan", {
                    orderId: createdOrder.id,
                    orderDate: new Date().toLocaleDateString("vi-VN"),
                    paymentMethod: paymentMethod.name,
                    orderItems: checkoutData.items.map(item => ({
                        productName: item.productName || item.skuNo,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        itemTotal: item.itemTotal,
                    })),
                    orderTotal,
                })
            ).catch(console.error);
            retry(async () =>
                await NotfiticationService.sendNotification(userId, "Thanh toans ")
            ).catch(console.error);

            await RedisService.remove(`checkout:${userId}:${paymentIntentId}`);

            return {
                orderCreated: true,
                paymentIntentId,
                orderId: createdOrder.id,
                total: orderTotal,
                shippingTrackingCode: ghnOrderRes?.data?.order_code || null,
            };
        } catch (error) {
            if (transaction && !transaction.finished) await transaction.rollback();
            for (const lock of lockReleaseQueue) await RedisService.releaseLock(lock);
            throw error;
        }
    }

}

module.exports = CheckoutService;
