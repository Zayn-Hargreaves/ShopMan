const cartRepo = require("../models/repositories/cart.repo");
const RedisService = require("./Redis.Service");

class CartService {
    static async getCart(UserId,page, size){
        return await cartRepo.findAllProductInCart({UserId, page, size})
    }
    static async addProductToCart({UserId,ProductId, quantity}){
        return await cartRepo.addProductToCart({UserId,ProductId,quantity})
    }
    static async updateProductToCart({UserId,ProductId, quantity}){
        return await cartRepo.updateProductToCart({UserId,ProductId,quantity})
    }
    static async removeProductFromCart({UserId,ProductId}){
        return await cartRepo.removeProductFromCart({UserId,ProductId})
    }
    static async removeAllProductFromCart(UserId){
        return await cartRepo.deleteAllProductFromCart(UserId)
    }

    static async getCheckoutData({CartId, UserId, SelectedItems}){
        const cacheKey = `checkout:user:${UserId}:cart:${CartId}`
        let result = await RedisService.getCachedData(cacheKey)

        if(!result){
            result = await cartRepo.getSelectedItemsForCheckout({CartId, UserId, SelectedItems})
            if(result.shops.length >0){
                await RedisService.cacheData(cacheKey, result, 3600)
            }
        }
    }
}

module.exports = CartService