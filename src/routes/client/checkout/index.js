const router = require("express").Router();
const { asyncHandler } = require("../../../helpers/asyncHandler");
const checkOutController = require("../../../controllers/client/Checkout.Controller");

/**
 * @swagger
 * tags:
 *   - name: Checkout
 *     description: API thanh toán (giỏ hàng và mua ngay dùng chung)
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   parameters:
 *     AccessTokenHeader:
 *       in: header
 *       name: Authorization
 *       required: true
 *       schema:
 *         type: string
 *         example: "Bearer <access_token>"
 *       description: Access token để xác thực người dùng
 *   schemas:
 *     CheckoutItem:
 *       type: object
 *       required: [productId, skuNo, quantity]
 *       properties:
 *         productId:
 *           type: integer
 *           example: 1
 *         skuNo:
 *           type: string
 *           example: "SKU-ABC-123"
 *         quantity:
 *           type: integer
 *           example: 2
 *         discountIds:
 *           type: array
 *           items:
 *             type: integer
 *     CheckoutRequest:
 *       type: object
 *       required: [selectedItems, addressId, paymentMethodId]
 *       properties:
 *         selectedItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CheckoutItem'
 *         addressId:
 *           type: integer
 *           example: 12
 *         paymentMethodId:
 *           type: integer
 *           example: 3
 *         source:
 *           type: string
 *           enum: [cart, buynow]
 *           example: buynow
 */

/**
 * @swagger
 * /api/v1/checkout:
 *   post:
 *     tags: [Checkout]
 *     summary: Tạo phiên thanh toán (áp dụng cho cả giỏ hàng và mua ngay)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/AccessTokenHeader'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckoutRequest'
 *     responses:
 *       200:
 *         description: Tạo paymentIntent thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tạo thanh toán thành công
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     paymentIntentClientSecret:
 *                       type: string
 *                     paymentIntentId:
 *                       type: string
 *                     totalAmount:
 *                       type: number
 */

/**
 * @swagger
 * /api/v1/checkout/confirm:
 *   post:
 *     tags: [Checkout]
 *     summary: Xác nhận thanh toán & tạo đơn hàng
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/AccessTokenHeader'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [paymentIntentId]
 *             properties:
 *               paymentIntentId:
 *                 type: string
 *                 example: pi_1Nk4WKLZ0a3OK6
 *     responses:
 *       200:
 *         description: Tạo đơn hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Xác nhận đơn hàng thành công
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     orderCreated:
 *                       type: boolean
 *                     orderId:
 *                       type: integer
 *                     total:
 *                       type: number
 */

router.post("/", asyncHandler(checkOutController.checkout));
router.post("/confirm", asyncHandler(checkOutController.confirmPayment));

module.exports = router;
