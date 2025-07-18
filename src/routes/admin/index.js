const { checkShop } = require("../../auth/authUtils");
const shopController = require("../../controllers/admin/shop.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");

const router = require("express").Router()

/* @swagger
 * tags:
 *   - name: Admin - Shop
 *     description: Quản lý shop (tạo mới, duyệt, sửa, xoá)

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
 *       description: Token xác thực người dùng
 *   schemas:
 *     RegisterShopRequest:
 *       type: object
 *       required: [name]
 *       properties:
 *         name:
 *           type: string
 *           example: Cửa hàng Hoa Sen
 *         description:
 *           type: string
 *           example: Chuyên mỹ phẩm thiên nhiên
 *         phone:
 *           type: string
 *           example: "0912345678"
 *         email:
 *           type: string
 *           example: "cuahang@example.com"
 *         address:
 *           type: string
 *           example: "123 Đường Láng, Hà Nội"
 */

/**
 * @swagger
 * /api/v1/admin/shop/register:
 *   post:
 *     tags: [Admin - Shop]
 *     summary: Đăng ký shop mới (người dùng hiện tại làm chủ)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/AccessTokenHeader'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterShopRequest'
 *     responses:
 *       200:
 *         description: Tạo shop thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Register shop success
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 12
 *                     name:
 *                       type: string
 *                     status:
 *                       type: string
 *                       example: pending
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc đã có shop
 *       401:
 *         description: Không xác thực
 */
router.post("/register",asyncHandler(shopController.registerShop))

router.use('/:ShopId/shop',checkShop, require('./shop'));
router.use('/:ShopId/member',checkShop, require('./member'));
router.use('/:ShopId/product', checkShop,require('./product'));
router.use('/:ShopId/order', checkShop,require('./order'));
router.use('/:ShopId/inventory', checkShop,require('./inventory'));
router.use('/:ShopId/campaign', checkShop,require('./campaign'));
router.use('/:ShopId/discount', checkShop,require('./discount'));
router.use('/:ShopId/banner',checkShop, require('./banner'));
router.use('/:ShopId/analytics', checkShop,require('./analytics'));
router.use('/:ShopId/notification', checkShop,require('./notification'));
// router.use('/report', require('./report'));
// router.use('/complaint', require('./complaint'));
// router.use('/settings', require('./settings'));

module.exports = router;