const CheckoutController = require("../../../controllers/client/Checkout.Controller")
const { asyncHandler } = require("../../../helpers/asyncHandler")

const router = require("express").Router()

router.get("/", asyncHandler(CheckoutController.getAllPaymentMethod))

module.exports = router