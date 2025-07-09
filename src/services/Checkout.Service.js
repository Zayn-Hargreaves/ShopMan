const RepositoryFactory = require("../models/repositories/repositoryFactory");
const PaymentFactory = require("./payment/PaymentFactory");
const RedisService = require("./Redis.Service");
const EmailService = require("./Email.service");
const { retry } = require("../helpers/retryFuntion");
const { pushOrderToES, pushOrderDetailToES } = require("./elasticsearch/orderDetailES.service");
const NotfiticationService = require("./Notification.service");
const {
    createShipment,
    purchaseLabel,
    refundLabel,
    trackShipment,
    getShipment,
    getLabel
} = require("./shipping/ShippoService");
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
            const paymentMethod = await PaymentMethodRepo.findPaymentMethodById(paymentMethodId)
            console.log(paymentMethod)
            const paymentService = PaymentFactory.getPaymentService(paymentMethod.name);
            const paymentResult = await paymentService.createPayment({
                amount: Math.round(totalAmount),
                currency: "sgd",
                meta: { userId: String(userId), type: source },
            });

            const paymentIntentId = paymentResult.paymentIntentId || `cod_${Date.now()}`;
            await RedisService.set(`checkout:${userId}:${paymentIntentId}`, {
                userId,
                items: finalItems,
                totalAmount,
                addressId,
                paymentMethodId,
                type: source,
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
        const PaymentMethodRepo = RepositoryFactory.getRepository("PaymentMethodRepository");

        // 1. Lấy checkout session
        const checkoutData = await RedisService.get(`checkout:${userId}:${paymentIntentId}`);
        if (!checkoutData) throw new Error("Checkout session expired or invalid");

        // 2. Xác thực payment
        const paymentMethod = await PaymentMethodRepo.findPaymentMethodById(checkoutData.paymentMethodId);
        const paymentService = PaymentFactory.getPaymentService(paymentMethod.name);
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
                Status: paymentMethod.name == "COD" ? "unpaid": "paid",
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

            // ============ 7. Tạo shipment qua Shippo (North America) ============
            let shippoShipment = null, shippoTransaction = null, trackingNumber = null, labelUrl = null;

            try {
                // Địa chỉ gửi (Trump Tower NYC)
                const fromAddress = {
                    name: "ShopMan Demo",
                    street1: "721 5th Ave",
                    city: "New York",
                    state: "NY",
                    zip: "10022",
                    country: "US",
                    phone: "212-832-2000",
                    email: "shopman@example.com"
                };

                // Địa chỉ nhận (White House)
                const addressObj = await AddressRepo.findById(checkoutData.addressId);
                if (!addressObj) throw new Error("Không tìm thấy địa chỉ giao hàng!");

                // Convert address DB sang Shippo
                const toAddress = {
                    name: "White House",
                    street1: "1600 Pennsylvania Avenue NW",
                    city: "Washington",
                    state: "DC",
                    zip: "20500",
                    country: "US",
                    phone: "202-456-1111",
                    email: "customer@example.com"
                };

                // Tổng khối lượng kiện (demo: lấy tổng quantity)
                const totalWeight = checkoutData.items.reduce((sum, i) => sum + (i.quantity * 2), 0) || 2; // 2lb/item (giả lập)
                const parcel = {
                    length: "10",
                    width: "7",
                    height: "4",
                    distance_unit: "in",
                    weight: "2",
                    mass_unit: "lb"
                };

                // Tạo shipment
                shippoShipment = await createShipment({ fromAddress, toAddress, parcel });

                // Lấy rate rẻ nhất
                const rate = shippoShipment.rates[0];
                // Mua shipping label
                shippoTransaction = await purchaseLabel(shippoShipment.object_id, rate.object_id);
                trackingNumber = shippoTransaction.tracking_number;
                labelUrl = shippoTransaction.label_url;

                // Lưu tracking vào DB
                console.log(shippoTransaction)
                await OrderRepo.update(createdOrder.id, {
                    shippingProvider: "Shippo",
                    shippingTrackingCode: shippoTransaction.object_id,
                    shippingLabelUrl: labelUrl,
                    shippingStatus: "LABEL_CREATED" 
                }, { transaction });

            } catch (e) {
                console.error("Shippo API error:", e.message || e);
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
                shippingTrackingCode: trackingNumber,
                shippingProvider: "Shippo",
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
                        link: `/order/details/${createdOrder.id}`
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
                    trackingNumber,
                    labelUrl
                })
            ).catch(console.error);

            retry(async () => {
                const res = await NotfiticationService.sendNotification(userId, "Thanh toán đơn hàng thành công", `Bạn vừa thanh toán thành công đơn hàng ${createdOrder.id}`);
                console.log("[NOTI] Gửi notification result:", res);
                return res;
            }).catch(err => {
                console.error("[NOTI] Lỗi gửi notification:", err);
            });

            await RedisService.remove(`checkout:${userId}:${paymentIntentId}`);

            return {
                orderCreated: true,
                paymentIntentId,
                orderId: createdOrder.id,
                total: orderTotal,
                shippingTrackingCode: trackingNumber,
                shippingLabelUrl: labelUrl
            };
        } catch (error) {
            if (transaction && !transaction.finished) await transaction.rollback();
            for (const lock of lockReleaseQueue) await RedisService.releaseLock(lock);
            throw error;
        }
    }


}

module.exports = CheckoutService;
