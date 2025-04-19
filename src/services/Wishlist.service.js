const wishlistRepo = require("../models/repositories/wishlist.repo")
class WishlistService {
    static async getWishlist(userId,page, size){
        return await wishlistRepo.getProductInWishlist(userId,page, size)
    }
    static async removeProductFromWishlist(userId,productId){
        return await wishlistRepo.removeProductFromWishlist({userId,productId})
    }
    static async removeAllProductFromWishlist(userId){
        return await wishlistRepo.removeAllProductFromWishList(userId)
    }
    static async getCountProductInWishlist(userId){
        return await wishlistRepo.countProductInWishlist(userId)
    }
}

module.exports = WishlistService