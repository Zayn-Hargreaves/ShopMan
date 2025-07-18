const { NotFoundError } = require("../../cores/error.response");
const RepositoryFactory = require("../../models/repositories/repositoryFactory");
const { Op } = require("sequelize");

class OrderService {
    // Lấy danh sách đơn hàng theo shop (và filter)
    static async listOrders(shopId, query = {}) {
        await RepositoryFactory.initialize();
        const OrderRepo = RepositoryFactory.getRepository("OrderRepository");

        let {
            status,     
            userId,     
            from, to,   
            page = 1,
            limit = 20,
        } = query;
        return await OrderRepo.getListOrderByPagination(status, userId, from, to, page, limit, shopId)
    }

    // Lấy chi tiết đơn hàng (cả thông tin sản phẩm, user, order details)
    static async getOrder(shopId, orderDetailId) {
        await RepositoryFactory.initialize();
        const OrderRepo = RepositoryFactory.getRepository("OrderRepository");
        return await OrderRepo.getOrderDetailsByAdmin(orderDetailId, shopId)
    }

    // Cập nhật trạng thái đơn hàng (cancel, done, shipping, ...)
    static async updateOrderStatus(shopId, orderDetailId, status) {
        await RepositoryFactory.initialize();
        const OrderRepo = RepositoryFactory.getRepository("OrderRepository");
        const order = await OrderRepo.getOrderDetailsByAdmin(orderDetailId, shopId)
        if (!order) throw new NotFoundError("Order not found!");

        order.status = status;
        await order.save();

        return order;
    }

}

module.exports = OrderService;
