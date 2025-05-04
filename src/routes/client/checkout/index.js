const router = require('express').Router();
const { asyncHandler } = require('../../../helpers/asyncHandler');
const checkOutController = require('../../../controllers/Checkout.Controller');

/**
 * @swagger
 * /checkout/buynow:
 *   post:
 *     tags:
 *       - Checkout
 *     summary: Thanh toán ngay 1 sản phẩm (Buy Now)
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
router.post("/buynow", asyncHandler(checkOutController.buyNow));

/**
 * @swagger
 * /checkout/from-cart:
 *   post:
 *     tags:
 *       - Checkout
 *     summary: Thanh toán từ giỏ hàng
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
router.post("/from-cart", asyncHandler(checkOutController.fromCart));

/**
 * @swagger
 * /checkout/confirm:
 *   post:
 *     tags:
 *       - Checkout
 *     summary: Xác nhận thanh toán & tạo đơn hàng
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
router.post("/confirm", asyncHandler(checkOutController.confirmPayment));

module.exports = router;
