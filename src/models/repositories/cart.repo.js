const { NotFoundError } = require("../../cores/error.response")
const { getSelectData } = require("../../utils")
const { Sequelize, Op, where } = require("sequelize")

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
        this.DiscountsProducts = models.DiscountsProducts
    }

    async getOrCreateCart(UserId) {
        let cart = await this.Cart.findOne({ where: { UserId, cart_status: "active" } });
        if (!cart) {
            cart = await this.Cart.create({ UserId, cart_total: 0, cart_status: "active" });
        }
        return cart;
    }
    async findCartDetailById(CartDetailId){
        return await this.CartDetails.findOne({where:{id:CartDetailId}})
    }
    async findProductInCart(userId, productId, skuNo) {
        const cart = await this.Cart.findOne({
            where: { UserId: userId }
        })
        return await this.CartDetails.findOne({
            where: { CartId: cart.id },
            include: [
                {
                    model: this.Products,
                    as: 'product',
                    where: { id: productId }
                },
                {
                    model: this.Sku,
                    where: { sku_no: skuNo },
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
        const cart = await this.Cart.findOne({
            where: { UserId: UserId }
        })
        return await this.CartDetails.findAll({
            where: { CartId: cart.id },
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

    async updateProductToCart({ UserId, CartDetailId, sku_no, quantity }) {
        const { Cart, CartDetails, Products, Sku, SkuAttr, SkuSpecs } = this;

        const cart = await Cart.findOne({ where: { UserId, cart_status: "active" } });
        if (!cart) throw new NotFoundError("Cart not found");

        const item = await CartDetails.findOne({ where: { CartId: cart.id, id: CartDetailId } });
        if (!item) throw new NotFoundError("Product not found in cart");

        if (quantity === 0) {
            await item.destroy();
            return null;
        }

        if (sku_no && sku_no !== item.sku_no) {
            const existing = await CartDetails.findOne({
                where: {
                    CartId: cart.id,
                    ProductId: item.ProductId,
                    sku_no: sku_no
                }
            });

            if (existing) {
                existing.quantity += quantity;
                await existing.save();
                await item.destroy();

                return existing.reload({
                    include: [
                        { model: Products, as: "product" },
                        {
                            model: Sku,
                            as: "Sku",
                            include: [
                                { model: SkuAttr, as: "SkuAttr" },
                                { model: SkuSpecs, as: "SkuSpecs" },
                            ]
                        }
                    ]
                });
            } else {
                item.sku_no = sku_no;
                item.quantity = quantity;
                await item.save();

                return item.reload({
                    include: [
                        { model: Products, as: "product" },
                        {
                            model: Sku,
                            as: "Sku",
                            include: [
                                { model: SkuAttr, as: "SkuAttr" },
                                { model: SkuSpecs, as: "SkuSpecs" },
                            ]
                        }
                    ]
                });
            }
        } else {
            item.quantity = quantity;
            await item.save();

            return item.reload({
                include: [
                    { model: Products, as: "product" },
                    {
                        model: Sku,
                        as: "Sku",
                        include: [
                            { model: SkuAttr, as: "SkuAttr" },
                            { model: SkuSpecs, as: "SkuSpecs" },
                        ]
                    }
                ]
            });
        }
    }


    async removeProductFromCart(UserId, ProductId, sku_no) {
        const cart = await this.Cart.findOne({ where: { UserId, cart_status: "active" } });
        if (!cart) throw new NotFoundError("Cart not found");

        return await this.CartDetails.destroy({ where: { CartId: cart.id, ProductId, sku_no } });
    }

    async deleteAllProductFromCart(UserId, CartDetailIds) {
        const cart = await this.Cart.findOne({ where: { UserId, cart_status: "active" } });
        if (!cart) return 0;
        return await this.CartDetails.destroy({ where: { CartId: cart.id, id: CartDetailIds } });
    }
    async getAvailableDiscounts(productId) {
        const now = new Date();

        const discounts = await this.Discounts.findAll({
            where: {
                status: 'active',
                UserCounts: { [Op.lt]: Sequelize.col('MaxUses') },
                // StartDate: { [Op.lte]: now },
                // EndDate: { [Op.gte]: now }
            },
            include: [{
                model: this.DiscountsProducts,
                as: 'DiscountsProducts',
                where: { ProductId: productId },
                required: true,
            }]
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
