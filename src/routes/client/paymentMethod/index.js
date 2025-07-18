const CheckoutController = require("../../../controllers/client/Checkout.Controller")
const { asyncHandler } = require("../../../helpers/asyncHandler")

const router = require("express").Router()
/**
 * @swagger
 * /api/v1/payment-method:
 *   get:
 *     summary: Get all payment methods
 *     description: Returns a list of all active payment methods
 *     tags: [Payment method]
 *     responses:
 *       200:
 *         description: Get all payment method success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: get all payment method success
 *                 metadata:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Thanh toán khi nhận hàng (COD)"
 *                       status:
 *                         type: string
 *                         example: "active"
 */

router.get("/", asyncHandler(CheckoutController.getAllPaymentMethod))

module.exports = router