const router = require("express").Router();
const { asyncHandler } = require("../../../helpers/asyncHandler");
const checkOutController = require("../../../controllers/Checkout.Controller");

/**
 * @swagger
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
 * tags:
 *   - name: Checkout
 *     description: API thanh toán (Buy Now / Cart Checkout / Xác nhận thanh toán)
 */

/**
 * @swagger
 * /api/v1/checkout/buynow:
 *   post:
 *     tags: [Checkout]
 *     summary: Thanh toán ngay 1 sản phẩm (Buy Now)
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
 *             required: [productId, skuNo, quantity]
 *             properties:
 *               productId:
 *                 type: integer
 *               skuNo:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               discountIds:
 *                 type: array
 *                 items:
 *                   type: integer
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
 *                   example: Tạo thanh toán buy-now thành công
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     paymentIntentClientSecret:
 *                       type: string
 *                     totalAmount:
 *                       type: number
 */

/**
 * @swagger
 * /api/v1/checkout/from-cart:
 *   post:
 *     tags: [Checkout]
 *     summary: Thanh toán từ giỏ hàng
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
 *             required: [selectedItems]
 *             properties:
 *               selectedItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [productId, skuNo, quantity]
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     skuNo:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                     discountIds:
 *                       type: array
 *                       items:
 *                         type: integer
 *               shopDiscountIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Tạo paymentIntent từ giỏ hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tạo thanh toán từ cart thành công
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     paymentIntentClientSecret:
 *                       type: string
 *                     totalAmount:
 *                       type: number
 */

/**
 * @swagger
 * /api/v1/checkout/confirm:
 *   post:
 *     tags: [Checkout]
 *     summary: Xác nhận thanh toán và tạo đơn hàng
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
 *     responses:
 *       200:
 *         description: Đơn hàng đã được tạo thành công
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
