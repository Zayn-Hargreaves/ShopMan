const { OkResponse } = require("../cores/success.response")
const WishlistService = require("../services/Wishlist.service")

class wishlistController {
    getProductInWishlist = async (req, res, next) => {
        const userId = req.userId
        const { page, limit } = req.query
        new OkResponse({
            message: "get wishlist success",
            metadata: await WishlistService.getWishlist(userId, parseInt(page), parseInt(limit))
        }).send(res)
    }
    addProductToWishlist = async (req, res, next) => {
        const userId = req.userId
        const productId = req.body.productId
        new OkResponse({
            message: "add product to wishlist success",
            metadata: await WishlistService.addProductToWishlist(userId, productId)
        }).send(res)
    }
    removeProductFromWishlist = async (req, res, next) => {
        const userId = req.userId
        const productId = req.params.productId
        new OkResponse({
            message: 'remove product success',
            metadata: await WishlistService.removeProductFromWishlist(userId, productId)
        }).send(res)
    }
    removeAllProductFromWishlist = async (req, res, next) => {
        const userId = req.userId
        new OkResponse({
            message: 'remove all product success',
            metadata: await WishlistService.removeAllProductFromWishlist(userId)
        }).send(res)
    }
    getCountProductInWishlist = async (req, res, next) => {
        const userId = req.userId
        new OkResponse({
            message:"get number of product in wishlist success",
            metadata:await WishlistService.getCountProductInWishlist(userId)
        }).send(res)
    }
}

module.exports = new wishlistController()