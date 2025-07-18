const { checkPermission, checkShopActive } = require('../../../auth/authUtils');
const bannerController = require('../../../controllers/admin/banner.controller');
const { asyncHandler } = require('../../../helpers/asyncHandler');

const router = require('express').Router();
/**
 * @swagger
 * tags:
 *   - name: Banner
 *     description: Quản lý banner quảng cáo cho cửa hàng
 *
 * /api/v1/admin/{ShopId}/banner:
 *   post:
 *     summary: Thêm banner mới cho cửa hàng
 *     tags: [Banner]
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
 *             $ref: '#/components/schemas/BannerInput'
 *     responses:
 *       200:
 *         description: Tạo banner thành công
 *
 * /api/v1/admin/{ShopId}/banner/all:
 *   get:
 *     summary: Lấy tất cả banner trong hệ thống (Admin)
 *     tags: [Banner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: banner_type
 *         schema: { type: string }
 *       - in: query
 *         name: position
 *         schema: { type: string }
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Danh sách banner
 *
 * /api/v1/admin/{ShopId}/banner/{AdminShopId}:
 *   get:
 *     summary: Lấy banner theo shop
 *     tags: [Banner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: AdminShopId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách banner theo shop
 *
 * /api/v1/admin/{ShopId}/banner/update/{bannerId}:
 *   patch:
 *     summary: Cập nhật banner
 *     tags: [Banner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bannerId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BannerInput'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *
 * components:
 *   schemas:
 *     BannerInput:
 *       type: object
 *       required: [title, banner_type, position, start_time, end_time]
 *       properties:
 *         title:
 *           type: string
 *         banner_type:
 *           type: string
 *         position:
 *           type: integer
 *         thumb:
 *           type: string
 *         link_type:
 *           type: string
 *         link_target:
 *           type: string
 *         action:
 *           type: string
 *         start_time:
 *           type: string
 *           format: date-time
 *         end_time:
 *           type: string
 *           format: date-time
 *         priority:
 *           type: integer
 *         status:
 *           type: string
 *         CampaignId:
 *           type: string
 *         PartnerId:
 *           type: string
 *         ShopId:
 *           type: string
 */

router.post('/', checkPermission("banner",'create:any'),checkShopActive,asyncHandler(bannerController.addBanner));
router.get('/all', checkPermission("banner",'read:all'),checkShopActive,asyncHandler(bannerController.listBanners));
router.get('/:AdminShopId', checkPermission("banner",'read:any'),checkShopActive,asyncHandler(bannerController.listBanners));
router.patch('/update/:bannerId', checkPermission("banner", 'edit:any'),checkShopActive,asyncHandler(bannerController.updateBanner));

module.exports = router;
