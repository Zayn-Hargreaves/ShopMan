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
    static async removeProductFromWishlist(userId, productId) {
        await RepositoryFactory.initialize()
        const wishlistRepo = RepositoryFactory.getRepository("WishListRepository")
        return await wishlistRepo.removeProductFromWishlist(userId, productId)
    }
    static async removeAllProductFromWishlist(userId) {
        await RepositoryFactory.initialize()
        const wishlistRepo = RepositoryFactory.getRepository("WishListRepository")
        return await wishlistRepo.removeAllProductFromWishlist(userId)
    }
    static async getCountProductInWishlist(userId) {
        await RepositoryFactory.initialize()
        const wishlistRepo = RepositoryFactory.getRepository("WishListRepository")
        return await wishlistRepo.countProductInWishlist(userId)
    }
}

module.exports = WishlistService