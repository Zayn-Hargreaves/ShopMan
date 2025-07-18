const { checkShop, checkPermission } = require("../../../auth/authUtils")
const shopController = require("../../../controllers/admin/shop.controller")
const { asyncHandler } = require("../../../helpers/asyncHandler")

const router = require("express").Router()

/**
 * @swagger
 * tags:
 *   - name: Admin - Shop
 *     description: API quản lý cửa hàng dành cho admin hoặc chủ shop

 * components:
 *   schemas:
 *     ShopResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 12
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         address:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, active, banned]
 *           example: active
 *     UpdateShopStatusRequest:
 *       type: object
 *       required: [status]
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, active, banned]
 *           example: active
 */

/**
 * @swagger
 * /api/v1/admin/{ShopId}shop/my:
 *   get:
 *     tags: [Admin - Shop]
 *     summary: Lấy thông tin cửa hàng của chính người dùng
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/AccessTokenHeader'
 *     responses:
 *       200:
 *         description: Thông tin shop của người dùng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShopResponse'
 */

/**
 * @swagger
 * /api/v1/admin/{ShopId}shop:
 *   put:
 *     tags: [Admin - Shop]
 *     summary: Cập nhật thông tin cửa hàng của mình
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
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShopResponse'
 */

/**
 * @swagger
 * /api/v1/admin/{ShopId}shop/{AdminShopId}:
 *   get:
 *     tags: [Admin - Shop]
 *     summary: Lấy thông tin chi tiết 1 shop (bằng Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: AdminShopId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của shop cần xem
 *       - $ref: '#/components/parameters/AccessTokenHeader'
 *     responses:
 *       200:
 *         description: Lấy thông tin shop thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShopResponse'
 */

/**
 * @swagger
 * /api/v1/admin/{ShopId}shop/all:
 *   get:
 *     tags: [Admin - Shop]
 *     summary: Liệt kê toàn bộ shop (filter theo trạng thái, tên)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/AccessTokenHeader'
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Tên shop (search)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, active, banned]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: Danh sách shop có phân trang
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ShopResponse'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 */

/**
 * @swagger
 * /api/v1/admin/{ShopId}shop/{AdminShopId}/status:
 *   patch:
 *     tags: [Admin - Shop]
 *     summary: Cập nhật trạng thái hoạt động của shop
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: AdminShopId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của shop cần cập nhật
 *       - $ref: '#/components/parameters/AccessTokenHeader'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateShopStatusRequest'
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShopResponse'
 */


router.get("/my", asyncHandler(checkPermission('shop', 'read:any')), asyncHandler(shopController.getMyShop))
router.put("/", asyncHandler(checkPermission('shop', 'update:any')), asyncHandler(shopController.updateShop))
router.get("/:AdminShopId", asyncHandler(checkPermission('shop', 'read:all')), asyncHandler(shopController.getShop))
router.get("/all", asyncHandler(checkPermission('shop','read:all')),asyncHandler(shopController.listShops))
router.patch("/:AdminShopId/status", asyncHandler(checkPermission('shop','update:all')),asyncHandler(shopController.updateShopStatus))

module.exports = router