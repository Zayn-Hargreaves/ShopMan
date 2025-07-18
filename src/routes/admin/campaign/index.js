const { checkPermission, checkShopActive } = require('../../../auth/authUtils');
const campaignController = require('../../../controllers/admin/campaign.controller');
const { asyncHandler } = require('../../../helpers/asyncHandler');

const router = require('express').Router();

/**
 * @swagger
 * tags:
 *   - name: Campaign
 *     description: API quản lý chiến dịch quảng cáo trong shop

 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT

 *   schemas:
 *     Campaign:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         thumb:
 *           type: string
 *         start_time:
 *           type: string
 *           format: date-time
 *         end_time:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *         ShopIds:
 *           type: array
 *           items:
 *             type: integer
 *         discountIds:
 *           type: array
 *           items:
 *             type: integer
 *         bannerId:
 *           type: integer
 */

/**
 * @swagger
 * /api/v1/admin/{ShopId}/campaign/all:
 *   get:
 *     summary: Lấy danh sách tất cả campaign (superadmin)
 *     tags: [Admin - Campaign]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ShopId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách campaign
 */

/**
 * @swagger
 * /api/v1/admin/{ShopId}/campaign/{AdminShopId}:
 *   get:
 *     summary: Lấy danh sách campaign theo shop
 *     tags: [Admin - Campaign]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ShopId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: AdminShopId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách campaign theo shop
 */

/**
 * @swagger
 * /api/v1/admin/{ShopId}/campaign:
 *   post:
 *     summary: Thêm campaign mới
 *     tags: [Admin - Campaign]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ShopId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Campaign'
 *     responses:
 *       200:
 *         description: Tạo campaign thành công
 */

/**
 * @swagger
 * /api/v1/admin/{ShopId}/campaign/update/{campaignId}:
 *   patch:
 *     summary: Cập nhật campaign
 *     tags: [Admin - Campaign]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ShopId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Campaign'
 *     responses:
 *       200:
 *         description: Cập nhật campaign thành công
 */

/**
 * @swagger
 * /api/v1/admin/{ShopId}/campaign/detail/{campaignId}:
 *   get:
 *     summary: Lấy chi tiết campaign
 *     tags: [Admin - Campaign]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ShopId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chi tiết campaign
 */

/**
 * @swagger
 * /api/v1/admin/{ShopId}/campaign/product/{campaignId}:
 *   get:
 *     summary: Lấy danh sách sản phẩm trong campaign
 *     tags: [Admin - Campaign]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ShopId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm
 */

router.get("/detail/:campaignId", checkPermission("campaign",'read:any'), checkShopActive, asyncHandler(campaignController.getCampaignDetail))
router.get("/product/:campaignId", checkPermission("campaign",'read:any'), checkShopActive, asyncHandler(campaignController.getCampaignProduct))
router.post('/', checkPermission('campaign', 'create::any'),checkShopActive, asyncHandler(campaignController.addCampaign));
router.get('/all', checkPermission('campaign', 'read:all'), checkShopActive,asyncHandler(campaignController.listCampaigns));
router.get('/:AdminShopId', checkPermission('campaign', 'read:any'), checkShopActive,asyncHandler(campaignController.listCampaigns));
router.patch('/update/:campaignId', checkPermission('campaign', 'edit:any'), checkShopActive,asyncHandler(campaignController.updateCampaign));


module.exports = router;
