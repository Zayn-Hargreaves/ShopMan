const initializeModels = require("../../db/dbs/associations")
const { getSelectData } = require("../../utils")
class WishlistRepository {
    constructor(models) {
        this.Wishlists = models.Wishlists
        this.Products = models.Products
    }
    async getProductInWishlist(UserId, page = 1, limit = 10) {
        const offset = (page - 1) * limit
        const { count, rows } = await this.Wishlists.findAndCountAll({
            where: { UserId: UserId },
            include: {
                model: this.Products,
                as:'product',
                attributes: getSelectData(['id', 'name', 'thumb', 'price', 'rating', 'desc', 'ShopId', 'slug'])
            },
            offset,
            limit,
        })
        return {
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            products: rows
        }
    }
    async addProductToWishlist(userId,productId){
        return await this.Wishlists.create({
            UserId:userId,
            ProductId:productId
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
        if (!UserId || !ProductId) {
            throw new Error("Missing UserId or ProductId")
        }
        return await this.Wishlists.destroy({
            where: {
                UserId,
                ProductId
            }
        })
    }
    async removeAllProductFromWishlist(UserId) {
        if (!UserId) {
            throw new Error("Missing UserId")
        }
        return await this.Wishlists.destroy({
            where: { UserId }
        })
    }
    async countProductInWishlist(UserId) {
        if (!UserId) {
            throw new Error("Missing UserId")
        }
        return await this.Wishlists.count({
            where: { UserId }
        })
    }
}

module.exports = WishlistRepository