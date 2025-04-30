const RepositoryFactory = require("../models/repositories/repositoryFactory");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const { Op } = require("sequelize");
const RedisService = require("./Redis.Service");
const { v4: uuidv4 } = require("uuid");
const EmailService = require("./Email.service")
const {retry} = require("../helpers/retryFuntion")
class CheckoutService {
    static async fromCart({ userId, selectedItems = [], shopDiscountIds = [] }) {
        await RepositoryFactory.initialize();
        const CartRepo = RepositoryFactory.getRepository("CartRepository");
        const DiscountRepo = RepositoryFactory.getRepository("DiscountRepository");

        if (!selectedItems.length) throw new Error("No products selected for checkout");

        let totalAmount = 0;
        const finalItems = [];
        const lockList = [];

        try {
            for (const item of selectedItems) {
                const { productId, skuNo, quantity, discountIds = [] } = item;

                const lock = await RedisService.acquireLock({
                    productID: productId,
                    cartID: userId,
                    quantity,
                    timeout: 10,
                });

                if (!lock) throw new Error(`Product ${productId} is being checked out by another user.`);
                lockList.push(lock);

                const productDetail = await CartRepo.findProductInCart(userId, productId, skuNo);

                if (!productDetail || productDetail.quantity < quantity) {
                    throw new Error(`Invalid or insufficient product: ${productId} | ${skuNo}`);
                }

                const unitPrice = productDetail.SkuAttr?.sku_price || productDetail.Sku?.sku_price || productDetail.Product?.price || 0;
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
                amount: Math.round(totalAmount * 100),
                currency: "sgd",
                metadata: { userId: String(userId) },
            });

            return {
                paymentIntentClientSecret: paymentIntent.client_secret,
                items: finalItems,
                totalAmount,
                shopDiscounts: shopLevelDiscounts,
            };
        } finally {
            for (const lock of lockList) {
                await RedisService.releaseLock(lock);
            }
        }
    }

    static async buyNow({ userId, productId, skuNo, quantity, discountIds = [] }) {
        await RepositoryFactory.initialize();
        const ProductRepo = RepositoryFactory.getRepository("ProductRepository");
        const DiscountRepo = RepositoryFactory.getRepository("DiscountRepository");

        const lock = await RedisService.acquireLock({
            productID: productId,
            cartID: userId,
            quantity,
            timeout: 10,
        });
        if (!lock) throw new Error(`Product ${productId} is being processed by another user.`);

        try {
            const productDetail = await ProductRepo.getProductWithSku(productId, skuNo);

            if (!productDetail || productDetail.sku_stock < quantity) {
                throw new Error("Product not available or insufficient stock");
            }

            const unitPrice = productDetail.sku_price;
            let itemTotal = quantity * parseFloat(unitPrice);

            const validDiscounts = await DiscountRepo.validateDiscountsForProduct(productId, discountIds, itemTotal);
            const discountAmount = validDiscounts.reduce((sum, d) => {
                return sum + (d.type === 'amount' ? d.value : (itemTotal * d.value) / 100);
            }, 0);

            itemTotal -= discountAmount;

            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(itemTotal * 100),
                currency: "sgd",
                metadata: { userId: String(userId), productId, skuNo },
            });

            return {
                paymentIntentClientSecret: paymentIntent.client_secret,
                productId,
                skuNo,
                quantity,
                unitPrice,
                itemTotal,
                validDiscounts,
            };
        } finally {
            await RedisService.releaseLock(lock);
        }
    }

    // static async confirmPayment({ userId, paymentIntentId }) {
    //     await RepositoryFactory.initialize();
    //     const OrderRepo = RepositoryFactory.getRepository("OrderRepository");
    //     const CartRepo = RepositoryFactory.getRepository("CartRepository");
    //     const InventoryRepo = RepositoryFactory.getRepository("InventoryRepository");
    //     const NotificationRepo = RepositoryFactory.getRepository("NotificationRepository");
    //     const DiscountRepo = RepositoryFactory.getRepository("DiscountRepository");
    //     const PaymentRepo = RepositoryFactory.getRepository("PaymentRepository");
    //     const ProductRepo = RepositoryFactory.getRepository("ProductRepository")
    //     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    //     if (!paymentIntent || paymentIntent.status !== "succeeded") {
    //         throw new Error("Payment not completed or invalid");
    //     }

    //     const cartItems = await CartRepo.findAllProductInCart(userId);
    //     if (!cartItems.length) throw new Error("No items in cart");

    //     let orderTotal = 0;
    //     const orderDetailsData = [];

    //     for (const item of cartItems) {
    //         const unitPrice = item.SkuAttr?.sku_price || item.Sku?.sku_price || item.Product?.price || 0;
    //         const itemTotal = parseFloat(unitPrice) * item.quantity;
    //         orderTotal += itemTotal;

    //         // Giảm tồn kho
    //         await InventoryRepo.decrementStock({
    //             ProductId: item.ProductId,
    //             ShopId: item.Product.ShopId,
    //             quantity: item.quantity
    //         });

    //         // Tăng sale count sản phẩm
    //         await OrderRepo.increaseSaleCount(item.ProductId, item.quantity);

    //         // Giảm UserCounts của discount (nếu có)
    //         const discounts = await DiscountRepo.getAvailableDiscounts(item.ProductId);
    //         for (const d of discounts) {
    //             await DiscountRepo.incrementUserUsage(d.id);
    //         }

    //         // Thêm vào danh sách chi tiết đơn hàng
    //         orderDetailsData.push({
    //             ProductId: item.ProductId,
    //             quantity: item.quantity,
    //             price_at_time: unitPrice,
    //         });

    //         // Xoá item trong giỏ hàng
    //         await CartRepo.removeItemFromCart(userId, item.ProductId, item.sku_no);
    //         await ProductRepo.increaseSaleCount(item.productId, item.quantity);

    //     }

    //     // Tạo đơn hàng
    //     const order = await OrderRepo.createOrder({
    //         UserId: userId,
    //         TotalPrice: orderTotal,
    //         Status: "paid"
    //     });

    //     // Tạo chi tiết đơn hàng
    //     await OrderRepo.bulkCreateOrderDetails(order.id, orderDetailsData);

    //     // Tạo thông báo cho người dùng
    //     await NotificationRepo.create({
    //         type: "order",
    //         option: "success",
    //         content: `Đơn hàng ${order.id} của bạn đã được thanh toán thành công`,
    //         UserId: userId
    //     });

    //     // Tạo bản ghi payment
    //     await PaymentRepo.create({
    //         UserId: userId,
    //         OrderId: order.id,
    //         TotalPrice: orderTotal,
    //         Status: "succeeded",
    //         PaymentMethodId: 1 // Stripe
    //     });

    //     // Gửi email
    //     const userInfo = await OrderRepo.getUserInfo(userId);
    //     const emailService = new EmailService(userInfo, null);
    //     await emailService.sendInvoice("invoice", "Xác nhận đơn hàng ShopMan", {
    //         orderId: order.id,
    //         orderDate: new Date().toLocaleDateString("vi-VN"),
    //         paymentMethod: "Stripe",
    //         orderItems: orderDetailsData,
    //         orderTotal: orderTotal,
    //     });

    //     return {
    //         orderCreated: true,
    //         paymentIntentId,
    //         orderId: order.id,
    //         total: orderTotal,
    //     };
    // }

    static async confirmPayment({ userId, paymentIntentId }) {
        await RepositoryFactory.initialize();
        const OrderRepo = RepositoryFactory.getRepository("OrderRepository");
        const CartRepo = RepositoryFactory.getRepository("CartRepository");
        const InventoryRepo = RepositoryFactory.getRepository("InventoryRepository");
        const NotificationRepo = RepositoryFactory.getRepository("NotificationRepository");
        const DiscountRepo = RepositoryFactory.getRepository("DiscountRepository");
        const PaymentRepo = RepositoryFactory.getRepository("PaymentRepository");
        const ProductRepo = RepositoryFactory.getRepository("ProductRepository");

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (!paymentIntent || paymentIntent.status !== "succeeded") {
            throw new Error("Payment not completed or invalid");
        }

        const cartItems = await CartRepo.findAllProductInCart(userId);
        if (!cartItems.length) throw new Error("No items in cart");

        let orderTotal = 0;
        const orderDetailsData = [];

        for (const item of cartItems) {
            const unitPrice = item.SkuAttr?.sku_price || item.Sku?.sku_price || item.Product?.price || 0;
            const itemTotal = parseFloat(unitPrice) * item.quantity;
            orderTotal += itemTotal;

            await InventoryRepo.decrementStock({
                ProductId: item.ProductId,
                ShopId: item.Product.ShopId,
                quantity: item.quantity,
            });

            await ProductRepo.increaseSaleCount(item.ProductId, item.quantity);
            const discounts = await DiscountRepo.getAvailableDiscounts(item.ProductId);
            for (const d of discounts) {
                await DiscountRepo.incrementUserUsage(d.id);
            }

            orderDetailsData.push({
                ProductId: item.ProductId,
                quantity: item.quantity,
                price_at_time: unitPrice,
            });

            await CartRepo.removeItemFromCart(userId, item.ProductId, item.sku_no);
        }

        const order = await OrderRepo.createOrder({
            UserId: userId,
            TotalPrice: orderTotal,
            Status: "paid",
        });

        await OrderRepo.bulkCreateOrderDetails(order.id, orderDetailsData);

        retry(() =>
            NotificationRepo.create({
                type: "order",
                option: "success",
                content: `Đơn hàng ${order.id} của bạn đã được thanh toán thành công`,
                UserId: userId,
            })
        ).catch(console.error);

        retry(() =>
            PaymentRepo.create({
                UserId: userId,
                OrderId: order.id,
                TotalPrice: orderTotal,
                Status: "succeeded",
                PaymentMethodId: 1,
            })
        ).catch(console.error);

        const userInfo = await OrderRepo.getUserInfo(userId);
        const emailService = new EmailService(userInfo, null);
        retry(() =>
            emailService.sendInvoice("invoice", "Xác nhận đơn hàng ShopMan", {
                orderId: order.id,
                orderDate: new Date().toLocaleDateString("vi-VN"),
                paymentMethod: "Stripe",
                orderItems: orderDetailsData,
                orderTotal: orderTotal,
            })
        ).catch(console.error);

        return {
            orderCreated: true,
            paymentIntentId,
            orderId: order.id,
            total: orderTotal,
        };
    }

}

module.exports = CheckoutService;