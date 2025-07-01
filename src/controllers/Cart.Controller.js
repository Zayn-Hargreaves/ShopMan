const { OkResponse } = require("../cores/success.response")
const CartService = require("../services/Cart.service.js")
class CartController {
    getCart = async (req, res, next) => {
        const userId = req.userId
        new OkResponse({
            message: "get cart success",
            metadata: await CartService.getCart(userId)
        }).send(res)
    }

    addProductToCart = async (req, res, next) => {
        const { ProductId, skuNo, quantity } = req.body
        const userId = req.userId
        new OkResponse({
            message: "add product to cart success",
            metadata: await CartService.addProductToCart(userId, ProductId, skuNo, parseInt(quantity))
        }).send(res)
    }

    updateProductToCart = async (req, res, next) => {
        const { ProductId, skuNo, quantity } = req.body
        console.log(req.body)
        console.log(ProductId, skuNo, quantity)
        const userId = req.userId
        new OkResponse({
            message: 'update product to cart success',
            metadata: await CartService.updateProductToCart(userId, ProductId, skuNo, parseInt(quantity))
        }).send(res)
    }

    removeProductFromCart = async (req, res, next) => {
        const userId = req.userId
        const { productId} = req.params
        const {skuNo} = req.query
        console.log(productId, skuNo)
        new OkResponse({
            message: "remove product from cart success",
            metadata: await CartService.removeProductFromCart(userId, productId, skuNo)
        }).send(res)
    }

    removeAllProductFromCart = async (req, res, next) => {
        const userId = req.userId
        const CartDetailIds = req.body.CartDetailIds
        new OkResponse({
            message: 'remove all product from cart success',
            metadata: await CartService.removeAllProductFromCart(userId, CartDetailIds)
        }).send(res)
    }
    getNumberOfProductInCart = async(req, res,next)=>{
        const userId = req.userId
        new OkResponse({
            message:"get number of product in cart success",
            metadata:await CartService.getNumberProductInCart(userId)
        }).send(res)
    }
}

module.exports = new CartController()

