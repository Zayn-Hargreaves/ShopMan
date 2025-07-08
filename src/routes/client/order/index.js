const OrderController = require("../../../controllers/Order.Controller")
const { asyncHandler } = require("../../../helpers/asyncHandler")

const router = require("express").Router()

router.get("/", asyncHandler(OrderController.getListOrder))
router.get("/details/:id", asyncHandler(OrderController.getOrderDetail))
router.patch("/cancel/:id", asyncHandler(OrderController.cancelOrder))
module.exports = router