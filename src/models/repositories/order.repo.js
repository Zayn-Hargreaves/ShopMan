const { Op, where } = require("sequelize");
const { NotFoundError } = require("../../cores/error.response");
class OrderRepository {
    constructor(models) {
        this.Order = models.Order;
        this.OrderDetails = models.OrderDetails;
        this.User = models.User
        this.Address = models.Address
        this.Product = models.Products
        this.Sku = models.Sku
        this.PaymentMethod = models.PaymentMethod
        this.SkuAttr=  models.SkuAttr
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
            ShopId: item.ShopId,
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
            throw new NotFoundError("Không tìm thấy thông tin user để gửi mail.");
        }

        return {
            email: order.user.email,
            name: order.user.name,
        };
    }
    async getOrderDetails(userId, orderId, options = {}) {
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
                    model: this.PaymentMethod,
                    as: 'paymentMethod',
                    attributes: ['id', 'name', 'image_url']
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
                            model: this.Sku,
                            as: 'Sku',
                            attributes: ['sku_no', 'sku_name']
                        }
                    ]
                }

            ]
            , ...options
        })
    }
    async updateOrder(orderId, { Status, shippingStatus }, options = {}) {
        return await this.Order.update(
            {
                Status: Status,
                shippingStatus: shippingStatus
            },
            { where: { id: orderId }, ...options }
        );
    }

    async update(orderId, fieldsToUpdate = {}, options = {}) {
        return await this.Order.update(
            fieldsToUpdate,
            { where: { id: orderId }, ...options }
        );
    }
    async getOrderById(id, options = {}) {
        return await this.Order.findByPk(id, options)
    }
    async getListOrderByPagination(status, UserId, from, to, page, limit, ShopId) {
        let where = {}
        if (status) where.status = status
        if (UserId) where.UserId = UserId
        if (ShopId) where.ShopId = ShopId
        if (from || to) {
            where.createdAt = {}
            if (from) where.createdAt[Op.gte] = new Date(from)
            if (to) where.createdAt[Op.lte] = new Date(to)
        }
        const offset = (page - 1) * limit
        const { rows, count } = await this.OrderDetails.findAndCountAll({
            where,
            limit,
            offset,
            order: [["createdAt", "DESC"]],
            include: [{
                model: this.Product, as: "product",
                attributes: ['name', 'thumb']
            }]
        })
        return {
            items: rows,
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit)
        }
    }

    async getOrderDetailsByAdmin(id, ShopId) {
        return await this.OrderDetails.findOne({
            where: { id, ShopId },
            include: [{
                model: this.Order,
                as: "order",
                attributes:['UserId','AddressId','PaymentMethodId','Status',"shippingStatus","shippingProvider","shippingFee"],
                include:[{
                    model:this.User,
                    as:'user',
                    attributes:["name",'email','phone','avatar']
                },{
                    model:this.Address,
                    as:'Address',
                    attributes:['pincode','city','address','country']
                }]
            }, {

                model: this.Product, as: "product",
                attributes: ['name', 'thumb']
            },{
                model:this.Sku,
                as:"Sku",
                include:[{
                    model:this.SkuAttr,
                    as:"SkuAttr",
                    attributes:['sku_attrs']
                }]
            }]
        })
    }
    async findOneOrderDetails(ShopId, OrderId) {
        return await this.OrderDetails.findOne({
            where: {
                OrderId,
                ShopId,
            }
        })
    }
}

module.exports = OrderRepository;