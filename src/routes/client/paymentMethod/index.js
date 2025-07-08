const CheckoutController = require("../../../controllers/Checkout.Controller")
const { asyncHandler } = require("../../../helpers/asyncHandler")

const router = require("express").Router()

router.get("/", asyncHandler(CheckoutController.getAllPaymentMethod))

module.exports = router