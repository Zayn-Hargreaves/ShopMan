const wishlistRepo = require("../models/repositories/wishlist.repo")
const RepositoryFactory = require("../models/repositories/repositoryFactory")
class WishlistService {
    static async getWishlist(userId, lastId, limit) {
        await RepositoryFactory.initialize()
        const wishlistRepo = RepositoryFactory.getRepository("WishListRepository")
        return await wishlistRepo.getProductInWishlist(userId, lastId, limit)
    }
    static async addProductToWishlist(userId, productId) {
        await RepositoryFactory.initialize()
        const wishlistRepo = RepositoryFactory.getRepository("WishListRepository")
        return await wishlistRepo.addProductToWishlist(userId, productId)
    }
    static async removeProductFromWishlist(userId, ProductId) {
        await RepositoryFactory.initialize()
        const wishlistRepo = RepositoryFactory.getRepository("WishListRepository")
        return await wishlistRepo.removeProductFromWishlist(userId, ProductId)
    }
    static async removeAllProductFromWishlist(userId, WishlistItemIds) {
        await RepositoryFactory.initialize()
        const wishlistRepo = RepositoryFactory.getRepository("WishListRepository")
        return await wishlistRepo.removeAllProductFromWishlist(userId, WishlistItemIds)
    }
    static async getCountProductInWishlist(userId) {
        await RepositoryFactory.initialize()
        const wishlistRepo = RepositoryFactory.getRepository("WishListRepository")
        return await wishlistRepo.countProductInWishlist(userId)
    }
}

module.exports = WishlistService