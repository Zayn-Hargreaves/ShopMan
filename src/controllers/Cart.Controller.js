const { OkResponse } = require("../cores/success.response")
const CartService = require("../services/Cart.service.js")
const CheckoutService = require("../services/Checkout.Service.js")
class CartController {
    getCart = async (req, res, next) => {
        const userId = req.userId
        new OkResponse({
            message: "get cart success",
            metadata: await CartService.getCart(userId)
        }).send(res)
    }
    addProductToCart = async (req, res, next) => {
        const { ProductId, quantity } = req.query
        const userId = req.userId
        new OkResponse({
            message: "add product to cart success",
            metadata: await CartService.addProductToCart({ userId, ProductId, quantity })
        }).send(res)
    }
    updateProductToCart = async (req, res, next) => {
        const { ProductId, quantity } = req.query
        const userId = req.userId
        new OkResponse({
            message: 'update product to cart success',
            metadata: await CartService.updateProductToCart({ userId, ProductId, quantity })
        }).send(res)
    }
    removeProductFromCart = async (req, res, next) => {
        const userId = req.userId
        const ProductId = req.params.ProductId
        new OkResponse({
            message: "remove product from cart success",
            metadata: await CartService.removeProductFromCart({ userId, ProductId })
        }).send(res)
    }
    removeAllProductFromCart = async (req, res, next) => {
        const userId = req.userId
        new OkResponse({
            message: 'remove all product from cart success',
            metadata: await CartService.removeAllProductFromCart(userId)
        }).send(res)
    }

    getCheckoutData = async (req, res, next) => {
        const { CartId, SelectedItems } = req.body
        const UserId = req.userId
        new OkResponse({
            message: "Checkout data retrieved success",
            metadata: await CartService.getCheckoutData({ CartId, UserId, SelectedItems })
        }).send(res)
    }

    proceedToPayment = async (req, res, next) => {
        const { cartID, selectedItems, selectedDiscounts, user_address, user_payment } = req.body;
        const { userID } = req.userId;
        new OkResponse({
            message:'Order created success',
            metadata:await CheckoutService.checkoutOrder({cartID,userID, selectedItems, selectedDiscounts, user_address, user_payment})
        }).send(res)
    }
}

module.exports = new CartController()