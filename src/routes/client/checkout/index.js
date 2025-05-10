const router = require('express').Router();
const { asyncHandler } = require('../../../helpers/asyncHandler');
const checkOutController = require('../../../controllers/Checkout.Controller');

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
 *       name: authorization
 *       required: true
 *       schema:
 *         type: string
 *         example: "Bearer <access_token>"
 *       description: "Access token để xác thực người dùng, định dạng: Bearer <access_token>"
 */

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: |
 *       Các API trong nhóm này yêu cầu người dùng gửi access token để xác thực.
 *       
 *       👉 Cách gửi access token:
 *       - Trên Swagger UI, nhấn nút "Authorize" góc trên phải.
 *       - Trên app Android hoặc khi gửi request:
 *         - req.headers['authorization'] = 'Bearer ' + accessToken
 *       - Trên Postman: Header → authorization: Bearer <access_token>
 *
 *   - name: Checkout
 *     description: |
 *       Các API trong nhóm này yêu cầu người dùng gửi access token để xác thực.
 *       
 *       👉 Cách gửi access token:
 *       - Trên Swagger UI, nhấn nút "Authorize" góc trên phải.
 *       - Trên app Android hoặc khi gửi request:
 *         - req.headers['authorization'] = 'Bearer ' + accessToken
 *       - Trên Postman: Header → authorization: Bearer <access_token>
 */

/**
 * @swagger
 * /api/v1/user/profile:
 *   get:
 *     summary: Get user profile with main address
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/AccessTokenHeader'
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */

/**
 * @swagger
 * /api/v1/user/profile/update:
 *   put:
 *     summary: Update user profile and main address
 *     tags: [User]
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
 *             properties:
 *               User:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: John Doe
 *                   phone:
 *                     type: string
 *                     nullable: true
 *                     example: +1234567890
 *                   avatar:
 *                     type: string
 *                     nullable: true
 *                     example: https://example.com/avatar.jpg
 *               Address:
 *                 type: object
 *                 nullable: true
 *                 properties:
 *                   address:
 *                     type: string
 *                     example: 123 Main St
 *                   city:
 *                     type: string
 *                     example: New York
 *                   country:
 *                     type: string
 *                     example: USA
 *                   pincode:
 *                     type: string
 *                     example: 10001
 *                   address_type:
 *                     type: string
 *                     example: Main
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */

/**
 * @swagger
 * /checkout/buynow:
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
 *         description: Kết quả tạo paymentIntent thành công
 */

/**
 * @swagger
 * /checkout/from-cart:
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
 */

/**
 * @swagger
 * /checkout/confirm:
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
 *     responses:
 *       200:
 *         description: Đơn hàng đã được tạo, tồn kho đã cập nhật
 */



router.post("/buynow", asyncHandler(checkOutController.buyNow));

router.post("/from-cart", asyncHandler(checkOutController.fromCart));

router.post("/confirm", asyncHandler(checkOutController.confirmPayment));

module.exports = router;
