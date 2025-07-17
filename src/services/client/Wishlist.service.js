const wishlistRepo = require("../../models/repositories/wishlist.repo")
const RepositoryFactory = require("../../models/repositories/repositoryFactory")
const RedisService = require("./Redis.Service")
class WishlistService {
    static async getWishlist(userId, lastId, limit) {
        await RepositoryFactory.initialize()
        const wishlistRepo = RepositoryFactory.getRepository("WishListRepository")
        return await wishlistRepo.getProductInWishlist(userId, lastId, limit)
    }
    static async addProductToWishlist(userId, productId) {
        await RepositoryFactory.initialize()
        await RedisService.addManyToSet(`user:wishlist:${userId}`, `${productId}`)
        await RedisService.addManyToSet(`product:wishlist:${productId}`, `${userId}`)
        const wishlistRepo = RepositoryFactory.getRepository("WishListRepository")
        return await wishlistRepo.addProductToWishlist(userId, productId)
    }
    static async removeProductFromWishlist(userId, ProductId) {
        await RepositoryFactory.initialize()
        await RedisService.removeFromSet(`user:wishlist:${userId}`, `${ProductId}`)
        await RedisService.removeFromSet(`product:wishlist:${ProductId}`, `${userId}`)
        const wishlistRepo = RepositoryFactory.getRepository("WishListRepository")
        return await wishlistRepo.removeProductFromWishlist(userId, ProductId)
    }
    static async removeAllProductFromWishlist(userId, productItemIds) {
        await RepositoryFactory.initialize()
        const wishlistRepo = RepositoryFactory.getRepository("WishListRepository")
        for (let pid of productItemIds) {
            await RedisService.removeFromSet(`user:wishlist:${userId}`, String(pid));
            await RedisService.removeFromSet(`product:wishlist:${pid}`, String(userId));
        }
        return await wishlistRepo.removeAllProductFromWishlist(userId, WishlistItemIds)
    }
    static async getCountProductInWishlist(userId) {
        await RepositoryFactory.initialize()
        const wishlistRepo = RepositoryFactory.getRepository("WishListRepository")
        return await wishlistRepo.countProductInWishlist(userId)
    }
}

module.exports = WishlistService