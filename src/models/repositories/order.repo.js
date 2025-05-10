class OrderRepository {
    constructor(models) {
        this.Order = models.Order;
        this.OrderDetails = models.OrderDetails;
        this.User = models.User
    }

    async createOrder(orderData, options) {
        return await this.Order.create(orderData, options);
    }

    async updateOrderTotal(orderId, totalPrice, options) {
        return await this.Order.update(
            { TotalPrice: totalPrice },
            { where: { id: orderId }, ...options }
        );
    }

    async bulkCreateOrderDetails(orderId, items = [], options) {
        const details = items.map((item) => ({
            OrderId: orderId,
            ProductId: item.ProductId,
            quantity: item.quantity,
            price_at_time: item.price_at_time,
        }));

        return await this.OrderDetails.bulkCreate(details, options);
    }
    async getUserInfo(userId) {
        return await this.Order.findOne({
            where: { UserId: userId },
            include: [{ model: this.User, as: "user" }],
            order: [["createdAt", "DESC"]],
        });
    }

}

module.exports = OrderRepository;
