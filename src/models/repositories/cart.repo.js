const { getSelectData } = require("../../utils")
const { Sequelize, Op } = require("sequelize")

class CartRepository {
    constructor(models) {
        this.Cart = models.Cart
        this.Products = models.Products
        this.SpuToSku = models.SpuToSku
        this.Sku = models.Sku
        this.SkuAttr = models.SkuAttr
        this.SkuSpecs = models.SkuSpecs
        this.Shop = models.Shop
        this.CartDetails = models.CartDetails
        this.Discounts = models.Discounts
    }

    async getOrCreateCart(UserId) {
        let cart = await this.Cart.findOne({ where: { UserId, cart_status: "active" } });
        if (!cart) {
            cart = await this.Cart.create({ UserId, cart_total: 0, cart_status: "active" });
        }
        return cart;
    }
    async findProductInCart(userId, productId, skuNo) {
        return await this.CartDetails.findAll({
            where: { CartId: userId },
            include: [
                {
                    model: this.Products,
                    as: 'product'
                },
                {
                    model: this.Sku,
                    as: 'Sku',
                    include: [
                        { model: this.SkuAttr, as: 'SkuAttr' },
                        { model: this.SkuSpecs, as: 'SkuSpecs' }
                    ]
                }
            ]
        });
    }

    async findAllProductInCart(UserId) {
        return await this.CartDetails.findAll({
            where: { CartId: UserId },
            include: [
                {
                    model: this.Products,
                    as: "product",
                },
                {
                    model: this.Sku,
                    as: "Sku",
                    required: true,
                    include: [
                        { model: this.SkuAttr, as: "SkuAttr" },
                        { model: this.SkuSpecs, as: "SkuSpecs" },
                    ]
                }
            ]
        });
    }

    async addProductToCart({ UserId, ProductId, sku_no, quantity }) {
        const cart = await this.getOrCreateCart(UserId);
        let item = await this.CartDetails.findOne({ where: { CartId: cart.id, ProductId, sku_no } });
        if (item) {
            item.quantity += quantity;
            await item.save();
        } else {
            item = await this.CartDetails.create({ CartId: cart.id, ProductId, sku_no, quantity });

        }
        const test = await this.CartDetails.findOne({
            where: { id: item.id },
            include: [
                { model: this.Products, as: "product" },
                {
                    model: this.Sku,
                    as: "Sku",
                    include: [
                        { model: this.SkuAttr, as: "SkuAttr" },
                        { model: this.SkuSpecs, as: "SkuSpecs" },
                    ]
                }
            ]
        });
        return test
    }

    async updateProductToCart({ UserId, ProductId, sku_no, quantity }) {
        console.log(UserId, ProductId, sku_no, quantity)
        const cart = await this.Cart.findOne({ where: { UserId, cart_status: "active" } });
        if (!cart) throw new Error("Cart not found");

        const item = await this.CartDetails.findOne({ where: { CartId: cart.id, ProductId, sku_no } });
        if (!item) throw new Error("Product not found in cart");

        if (quantity === 0) {
            await item.destroy();
        } else {
            item.quantity = quantity;
            await item.save();
        }

        return await this.CartDetails.findOne({
            where: { id: item.id },
            include: [
                { model: this.Products, as: "product" },
                {
                    model: this.Sku,
                    as: "Sku",
                    include: [
                        { model: this.SkuAttr, as: "SkuAttr" },
                        { model: this.SkuSpecs, as: "SkuSpecs" },
                    ]
                }
            ]
        });
    }

    async removeProductFromCart(UserId, ProductId, sku_no) {
        console.log(UserId, ProductId, sku_no)
        const cart = await this.Cart.findOne({ where: { UserId, cart_status: "active" } });
        if (!cart) throw new Error("Cart not found");

        return await this.CartDetails.destroy({ where: { CartId: cart.id, ProductId, sku_no } });
    }

    async deleteAllProductFromCart(UserId) {
        const cart = await this.Cart.findOne({ where: { UserId, cart_status: "active" } });
        if (!cart) return 0;
        return await this.CartDetails.destroy({ where: { CartId: cart.id } });
    }
    async getAvailableDiscounts(productId) {
        const now = new Date();

        const discounts = await this.Discounts.findAll({
            include: [
                {
                    model: this.Products,
                    as: "products", // đúng alias
                    through: {
                        attributes: [],
                        where: { ProductId: productId }
                    },
                    attributes: []
                },
            ],
            where: {
                status: "active",
                StartDate: { [Op.lte]: now },
                EndDate: { [Op.gte]: now },
                UserCounts: { [Op.lt]: Sequelize.col("MaxUses") },
            },
            attributes: getSelectData([
                "id", "name", "desc", "value", "type",
                "code", "StartDate", "EndDate", "MinValueOrders"
            ]),
        });

        return discounts;
    }
    async removeItemsFromCart(cartId, items = []) {
        for (const item of items) {
            await this.CartDetails.destroy({
                where: {
                    CartId: cartId,
                    ProductId: item.productId,
                    sku_no: item.skuNo,
                },
            });
        }
    }
}

module.exports = CartRepository;
