const { NotFoundError } = require("../../cores/error.response")
const initializeModels = require("../../db/dbs/associations")
const { getSelectData } = require("../../utils")
const { Op, Sequelize } = require("sequelize")
class WishlistRepository {
    constructor(models) {
        this.Wishlists = models.Wishlists
        this.Products = models.Products
        this.User = models.User
    }
    async getProductInWishlist(UserId, lastId, limit = 10) {
        let where = { UserId: UserId }
        if (lastId) {
            where.id = { [this.Sequerlize.Op.lte]: lastId }
        }
        const rows = await this.Wishlists.findAll({
            where,
            include: {
                model: this.Products,
                as: 'product',
                attributes: getSelectData(['id', 'name', 'thumb', 'price', 'rating', 'desc', 'ShopId', 'slug', 'discount_percentage'])
            },
            order: [['id', 'ASC']],
            limit,
        });

        const newLastId = rows.length > 0 ? rows[rows.length - 1].id : null;

        return {
            products: rows,
            nextCursor: newLastId,
            hasMore: rows.length === limit,
        }
    }
    async addProductToWishlist(userId, productId) {
        if (!user) {
            throw new NotFoundError("User not found")
        }
        const product = await this.Products.findByPk(productId)
        if (!product) {
            throw new NotFoundError("Product not found")
        }
        let item = await this.Wishlists.findOne({
            where: {
                UserId: userId,
                ProductId: productId
            }
        })
        if (item) {
            return item
        }
        return await this.Wishlists.create({
            UserId: userId,
            ProductId: productId
        })
    }
    async checkProductInWishlist({ ProductId, UserId }) {
        return await this.Wishlists.findOne({
            where: {
                ProductId,
                UserId
            }
        })
    }
    async removeProductFromWishlist(UserId, ProductId) {
        if (!UserId) {
            throw new NotFoundError("Missing UserId")
        }
        return await this.Wishlists.destroy({
            where: {
                UserId,
                ProductId: ProductId
            }
        })
    }
    async removeAllProductFromWishlist(UserId, productItemIds) {
        if (!UserId) {
            throw new NotFoundError("Missing UserId")
        }
        return await this.Wishlists.destroy({
            where: {
                UserId,
                ProductId: productItemIds
            }
        })
    }
    async countProductInWishlist(UserId) {
        if (!UserId) {
            throw new NotFoundError("Missing UserId")
        }
        return await this.Wishlists.count({
            where: { UserId }
        })
    }
}

module.exports = WishlistRepository