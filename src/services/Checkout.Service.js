const RepositoryFactory = require("../models/repositories/repositoryFactory");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const RedisService = require("./Redis.Service");
const EmailService = require("./Email.service")
const { retry } = require("../helpers/retryFuntion")
class CheckoutService {
    static async fromCart({ userId, selectedItems = [], shopDiscountIds = [] }) {
        await RepositoryFactory.initialize();
        const CartRepo = RepositoryFactory.getRepository("CartRepository");
        const ProductRepo = RepositoryFactory.getRepository("ProductRepository");
        const DiscountRepo = RepositoryFactory.getRepository("DiscountRepository");

        if (!selectedItems.length) throw new Error("No products selected for checkout");

        let totalAmount = 0;
        const finalItems = [];
        const lockList = [];

        try {
            for (const item of selectedItems) {
                const { productId, skuNo, quantity, discountIds = [] } = item;

                const productInCart = await CartRepo.findProductInCart(userId, productId, skuNo);
                if (!productInCart || productInCart.quantity < quantity) {
                    throw new Error(`Invalid or insufficient cart quantity for product ${productId} | ${skuNo}`);
                }

                const productSku = await ProductRepo.getProductWithSku(productId, skuNo);
                if (!productSku) {
                    throw new Error(`Product ${productId} | ${skuNo} not found in product repository`);
                }

                const availableStock = productSku.sku_stock;
                const reservedQty = await RedisService.getReservedQuantity(productId, skuNo) || 0;

                if ((availableStock - reservedQty) < quantity) {
                    throw new Error(`Not enough stock for product ${productId} | ${skuNo}`);
                }

                const lock = await RedisService.acquireLock({
                    productID: productId,
                    skuNo: skuNo,
                    cartID: userId,
                    quantity,
                    timeout: 15,
                });

                if (!lock) throw new Error(`Product ${productId} is being checked out by another user.`);
                lockList.push(lock);

                const unitPrice = productSku.sku_price;
                let itemTotal = quantity * parseFloat(unitPrice);

                const validDiscounts = await DiscountRepo.validateDiscountsForProduct(productId, discountIds, itemTotal);
                const discountAmount = validDiscounts.reduce((sum, d) => {
                    return sum + (d.type === 'amount' ? d.value : (itemTotal * d.value) / 100);
                }, 0);

                itemTotal -= discountAmount;
                totalAmount += itemTotal;

                finalItems.push({
                    ...item,
                    unitPrice,
                    discountAmount,
                    itemTotal,
                    validDiscounts,
                });
            }

            const shopLevelDiscounts = await DiscountRepo.validateShopDiscounts(shopDiscountIds, totalAmount);
            const shopDiscountTotal = shopLevelDiscounts.reduce((sum, d) => {
                return sum + (d.type === 'amount' ? d.value : (totalAmount * d.value) / 100);
            }, 0);
            totalAmount -= shopDiscountTotal;

            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(totalAmount),
                currency: "sgd",
                metadata: { userId: String(userId), type: "cart" },
            });

            await RedisService.set(`checkout:${userId}:${paymentIntent.id}`, {
                items: finalItems,
                shopDiscounts: shopLevelDiscounts,
                totalAmount,
                type: "cart",
            }, 900);

            return {
                paymentIntentClientSecret: paymentIntent.client_secret,
                items: finalItems,
                totalAmount,
                shopDiscounts: shopLevelDiscounts,
            };
        } catch (error) {
            for (const lock of lockList) {
                await RedisService.releaseLock(lock);
            }
            throw error;
        }
    }


    static async buyNow({ userId, productId, skuNo, quantity, discountIds = [] }) {
        await RepositoryFactory.initialize();
        const ProductRepo = RepositoryFactory.getRepository("ProductRepository");
        const DiscountRepo = RepositoryFactory.getRepository("DiscountRepository");

        let lock = null;
        try {
            const productDetail = await ProductRepo.getProductWithSku(productId, skuNo);

            if (!productDetail || productDetail.sku_stock < quantity) {
                throw new Error("Product not available or insufficient stock");
            }

            const reservedQty = await RedisService.getReservedQuantity(productId, skuNo) || 0;
            if ((productDetail.sku_stock - reservedQty) < quantity) {
                throw new Error(`Not enough stock for product ${productId} | ${skuNo}`);
            }

            lock = await RedisService.acquireLock({
                productID: productId,
                skuNo: skuNo,
                cartID: userId,
                quantity,
                timeout: 900,
            });
            if (!lock) throw new Error(`Product ${productId} is being processed by another user.`);

            const unitPrice = productDetail.sku_price;
            let itemTotal = quantity * parseFloat(unitPrice);

            const validDiscounts = await DiscountRepo.validateDiscountsForProduct(productId, discountIds, itemTotal);
            const discountAmount = validDiscounts.reduce((sum, d) => {
                return sum + (d.type === 'amount' ? d.value : (itemTotal * d.value) / 100);
            }, 0);

            itemTotal -= discountAmount;

            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(itemTotal),
                currency: "sgd",
                metadata: { userId: String(userId), productId, skuNo, type: "buynow" },
            });

            await RedisService.set(`checkout:${userId}:${paymentIntent.id}`, {
                productId,
                skuNo,
                quantity,
                unitPrice,
                itemTotal,
                validDiscounts,
                type: "buynow",
            }, 900);

            return {
                paymentIntentClientSecret: paymentIntent.client_secret,
                productId,
                skuNo,
                quantity,
                unitPrice,
                itemTotal,
                validDiscounts,
            };
        } catch (error) {
            if (lock) await RedisService.releaseLock(lock);
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

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (!paymentIntent || paymentIntent.status !== "succeeded") {
            throw new Error("Payment not completed or invalid");
        }

        const checkoutData = await RedisService.get(`checkout:${userId}:${paymentIntentId}`);
        if (!checkoutData) throw new Error("Checkout session expired or invalid");

        let orderTotal = 0;
        const orderDetailsData = [];
        const lockReleaseQueue = [];

        const transaction = await sequelize.transaction();

        try {
            const order = await OrderRepo.createOrder({
                UserId: userId,
                TotalPrice: 0,
                Status: "paid",
            }, { transaction });

            if (checkoutData.type === "cart") {
                for (const item of checkoutData.items) {
                    const { productId, skuNo, quantity, unitPrice } = item;

                    await InventoryRepo.decrementStock({
                        ProductId: productId,
                        ShopId: item.ShopId || null,
                        quantity,
                        transaction,
                    });

                    await ProductRepo.increaseSaleCount(productId, quantity);

                    const discounts = await DiscountRepo.getAvailableDiscounts(productId);
                    for (const d of discounts) {
                        await DiscountRepo.incrementUserCounts(d.id);
                    }

                    orderTotal += item.itemTotal;
                    orderDetailsData.push({
                        ProductId: productId,
                        quantity,
                        price_at_time: unitPrice,
                    });

                    const cart = await CartRepo.getOrCreateCart(userId);
                    await CartRepo.removeItemsFromCart(cart.id, checkoutData.items.map(item => ({
                        productId: item.productId,
                        skuNo: item.skuNo
                    })));


                    lockReleaseQueue.push({
                        key: `lock:product:${productId}:cart:${userId}`,
                        token: null,
                        productID: productId,
                        skuNo,
                        cartID: userId,
                    });
                }
            } else if (checkoutData.type === "buynow") {
                const { productId, skuNo, quantity, unitPrice, itemTotal } = checkoutData;

                await InventoryRepo.decrementStock({
                    ProductId: productId,
                    ShopId: null,
                    quantity,
                    transaction,
                });

                await ProductRepo.increaseSaleCount(productId, quantity);

                const discounts = await DiscountRepo.getAvailableDiscounts(productId);
                for (const d of discounts) {
                    await DiscountRepo.incrementUserCounts(d.id);
                }

                orderTotal = itemTotal;
                orderDetailsData.push({
                    ProductId: productId,
                    quantity,
                    price_at_time: unitPrice,
                });

                lockReleaseQueue.push({
                    key: `lock:product:${productId}:cart:${userId}`,
                    token: null,
                    productID: productId,
                    skuNo,
                    cartID: userId,
                });
            }

            await OrderRepo.bulkCreateOrderDetails(order.id, orderDetailsData, { transaction });
            await OrderRepo.updateOrderTotal(order.id, orderTotal, { transaction });

            await PaymentRepo.create({
                UserId: userId,
                OrderId: order.id,
                TotalPrice: orderTotal,
                Status: "succeeded",
                PaymentMethodId: 1,
            }, { transaction });

            await transaction.commit();

            for (const lock of lockReleaseQueue) {
                await RedisService.releaseLock(lock);
            }

            retry(() =>
                NotificationRepo.create({
                    type: "order",
                    option: "success",
                    content: `Đơn hàng ${order.id} của bạn đã được thanh toán thành công`,
                    UserId: userId,
                })
            ).catch(console.error);

            const userInfo = await OrderRepo.getUserInfo(userId);
            const emailService = new EmailService(userInfo, null);
            retry(async () =>
                await emailService.sendInvoice("invoice", "Xác nhận đơn hàng ShopMan", {
                    orderId: order.id,
                    orderDate: new Date().toLocaleDateString("vi-VN"),
                    paymentMethod: "Stripe",
                    orderItems: checkoutData.items.map(item => ({
                        productName: item.productName || item.skuNo,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        itemTotal: item.itemTotal,
                    })),
                    orderTotal,
                })

            ).catch(console.error);

            await RedisService.remove(`checkout:${userId}:${paymentIntentId}`);

            return {
                orderCreated: true,
                paymentIntentId,
                orderId: order.id,
                total: orderTotal,
            };
        } catch (error) {
            await transaction.rollback();
            for (const lock of lockReleaseQueue) {
                await RedisService.releaseLock(lock);
            }
            throw error;
        }
    }

}

module.exports = CheckoutService;