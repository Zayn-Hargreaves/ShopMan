class OrderRepository {
    constructor(models) {
        this.Order = models.Order;
        this.OrderDetails = models.OrderDetails;
    }

    async createOrder(userId, totalPrice) {
        return await this.Order.create({
            UserId: userId,
            TotalPrice: totalPrice,
            Status: "created",
        });
    }

    async createOrderDetails(orderId, items = []) {
        const details = items.map((item) => ({
            OrderId: orderId,
            ProductId: item.productId,
            quantity: item.quantity,
            price_at_time: item.unitPrice,
        }));
        return await this.OrderDetails.bulkCreate(details);
    }
}

module.exports = OrderRepository;