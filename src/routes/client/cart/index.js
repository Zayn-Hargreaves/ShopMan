const router = require("express").Router()
const {asyncHandler} = require("../../../helpers/asyncHandler")
const CartController = require("../../../controllers/Cart.Controller.js")

router.get("/", asyncHandler(CartController.getCart))
router.post("/add", asyncHandler(CartController.addProductToCart))
router.put("/update", asyncHandler(CartController.updateProductToCart))
router.delete("/remove/:productId", asyncHandler(CartController.removeProductFromCart))
router.delete("/remove/add", asyncHandler(CartController.removeAllProductFromCart))

router.post("/checkout/data", asyncHandler(CartController.getCheckoutData));
router.post("/checkout/proceed", asyncHandler(CartController.proceedToPayment));
module.exports = router