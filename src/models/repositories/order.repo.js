class OrderRepository {
    constructor(models) {
        this.Order = models.Order;
        this.OrderDetails = models.OrderDetails;
        this.User = models.User
        this.Address = models.Address
        this.Product = models.Products
        this.Sku = models.Sku
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
            sku_no: item.sku_no,
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
    async getOrderDetails(userId, orderId) {
        return await this.Order.findOne({
            where: {
                id: orderId,
                UserId: userId
            },
            include: [
                {
                    model: this.User,
                    as: "user",
                    attributes: ["email", "name", 'phone']

                },
                {
                    model: this.Address,
                    as: 'Address',
                    attributes: ["pincode", 'address', 'city', 'country']
                },
                {
                    model: this.OrderDetails,
                    as: "orderDetails",
                    attributes: ['quantity', 'price_at_time', 'ProductId', 'ShopId', 'sku_no'],
                    include: [
                        {
                            model: this.Product,
                            as: 'product',
                            attributes: ['name', 'thumb', 'slug', "ShopId"],
                        },
                        {
                            model:this.Sku,
                            as:'Sku',
                            attributes:['sku_no','sku_name']
                        }
                    ]
                }

            ]
        })
    }
    async updateOrder(orderId, { Status }, options = {}) {
        return await this.Order.update({ where: { id: orderId }, status: Status }, ...options)
    }
    async update(orderId, fieldsToUpdate = {}, options = {}) {
    return await this.Order.update(
        fieldsToUpdate,
        { where: { id: orderId }, ...options }
    );
}
    async getOrderById(id) {
        return await this.Order.findByPk(id)
    }
}

module.exports = OrderRepository;