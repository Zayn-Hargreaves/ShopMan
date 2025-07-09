const RepositoryFactory = require("../models/repositories/repositoryFactory");
const EmailService = require("./Email.service")
const {retry} = require("./../helpers/retryFuntion")
const {
    createShipment,
    purchaseLabel,
    refundLabel,
    trackShipment,
    getShipment,
    getLabel
} = require("./shipping/ShippoService");
class OrderService {
    static async getOrderDetais(userId, orderId) {
        await RepositoryFactory.initialize();
        const OrderRepository = RepositoryFactory.getRepository("OrderRepository")
        const result = await OrderRepository.getOrderDetails(userId, orderId);

        if (result && result.shippingProvider === "GHN" && result.shippingTrackingCode) {
            try {
                const ghnInfo = await GhnService.getOrderInfo(result.shippingTrackingCode);
                result.shippingInfo = ghnInfo.data;
            } catch (e) {
                console.error("GHN getOrderInfo error", e.message);
                result.shippingInfo = null;
            }
        }
        return result;
    }

    static async cancelOrder(userId, orderId) {
        await RepositoryFactory.initialize();
        const sequelize = RepositoryFactory.getSequelize()
        const OrderRepo = RepositoryFactory.getRepository("OrderRepository")
        const InventoryRepo = RepositoryFactory.getRepository("InventoryRepository")
        const ProductRepo = RepositoryFactory.getRepository("ProductRepository")
        const UserRepo = RepositoryFactory.getRepository("UserRepository")
        const PaymentMethodRepo = RepositoryFactory.getRepository("PaymentMethodRepository")
        const transaction = await sequelize.transaction()
        try {
            // 1. Lấy đơn hàng và kiểm tra trạng thái
            const order = await OrderRepo.getOrderById(orderId, { transaction });
            if (!order) throw new Error("Không tìm thấy đơn hàng!");
            if (order.shippingStatus === "cancelled") throw new Error("Đơn hàng đã bị huỷ trước đó!");
            if (["delivered", "completed"].includes(order.shippingStatus)) {
                throw new Error("Không thể huỷ đơn đã giao!");
            }
            if (order.UserId !== userId) throw new Error("Không có quyền huỷ đơn hàng này!");

            // 2. Update trạng thái đơn hàng
            await OrderRepo.updateOrder(orderId, { Status: "cancelled" }, { transaction });

            // 3. Lấy chi tiết đơn hàng (OrderDetails)
            const holderOrder = await OrderRepo.getOrderDetails(userId, orderId, { transaction });

            const PaymentMethod = await PaymentMethodRepo.findPaymentMethodById(order.PaymentMethodId)
            // 4. Trả lại tồn kho
            for (const item of holderOrder.orderDetails) {
                const sku = await ProductRepo.findSkuBySkuNo(item.sku_no)
                // Cộng tồn kho Inventory theo SkuId, ShopId
                await InventoryRepo.restoreStock({
                    SkuId: sku.id, // hoặc lấy từ sku_no
                    ShopId: item.ShopId,
                    quantity: item.quantity,
                    transaction
                });
                // Update lại trường sku_stock của Sku
                await ProductRepo.incrementStock(sku.id, item.quantity, { transaction });
            }
            // 5. Hoàn tiền nếu cần (chỉ với thanh toán online, hoặc policy shop)
            if (["Stripe", "Momo", "Zalopay"].includes(PaymentMethod.name)) {
                // Cộng lại balance cho user
                await UserRepo.incrementBalance(order.UserId, order.TotalPrice, { transaction });
            }

            // 6. (Tuỳ chọn) Gọi api GHN cancel đơn nếu đã tạo
            if (order.shippingProvider === "GHN" && order.shippingTrackingCode) {
                try {
                    await GhnService.cancelOrder(order.shippingTrackingCode);
                } catch (e) {
                    // Log lại để xử lý thủ công nếu fail
                    console.error("GHN cancel error", e.message);
                }
            }

            await transaction.commit();

           
        } catch (error) {
            if (transaction) await transaction.rollback();
            throw error;
        }
        retry(() =>
            NotificationRepo.create({
                type: "order",
                option: "cancel",
                content: `Đơn hàng ${createdOrder.id} của bạn đã được hủy thành công`,
                UserId: userId,
            })
        ).catch(console.error);

        // Email invoice
        const userInfo = await OrderRepo.getUserInfo(userId);
        const emailService = new EmailService(userInfo, null);
        retry(async () =>
            await emailService.sendInvoice("invoice", "Xác nhận hủy đơn hàng ShopMan", {
                orderId: createdOrder.id,
                orderDate: new Date().toLocaleDateString("vi-VN"),
                paymentMethod: PaymentMethod.name,
                orderItems: checkoutData.items.map(item => ({
                    productName: item.productName || item.skuNo,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    itemTotal: item.itemTotal,
                })),
                orderTotal,
            })
        ).catch(console.error);
        return { cancelled: true, orderId };
    }
}
module.exports = OrderService