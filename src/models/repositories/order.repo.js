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
        const order = await this.Order.findOne({
            where: { UserId: userId },
            include: [
                {
                    model: this.User,
                    as: "user",
                    attributes: ["email", "name"]
                }
            ],
            order: [["createdAt", "DESC"]],
        });

        if (!order || !order.user) {
            throw new Error("Không tìm thấy thông tin user để gửi mail.");
        }

        return {
            email: order.user.email,
            name: order.user.name,
        };
    }


}

module.exports = OrderRepository;
