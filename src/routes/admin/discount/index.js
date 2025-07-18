const { checkPermission, checkShopActive } = require('../../../auth/authUtils');
const bannerController = require('../../../controllers/admin/banner.controller');
const discountController = require('../../../controllers/admin/discount.controller');
const { asyncHandler } = require('../../../helpers/asyncHandler');

const router = require('express').Router();

/**
 * @swagger
 * tags:
 *   - name: Discount
 *     description: Quản lý mã giảm giá cho cửa hàng

 * /api/v1/admin/{ShopId}/discount/{AdminShopId}:
 *   post:
 *     summary: Thêm mã giảm giá mới cho cửa hàng
 *     tags: [Discount]
 *     parameters:
 *       - in: path
 *         name: AdminShopId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của shop
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DiscountInput'
 *     responses:
 *       200:
 *         description: Tạo mã giảm giá thành công
 *   get:
 *     summary: Lấy danh sách mã giảm giá theo shop
 *     tags: [Discount]
 *     parameters:
 *       - in: path
 *         name: AdminShopId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách mã giảm giá

 * /api/v1/admin/{ShopId}/discount/all:
 *   get:
 *     summary: Lấy tất cả mã giảm giá
 *     tags: [Discount]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: type
 *         schema: { type: string }
 *       - in: query
 *         name: code
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
 *         description: Danh sách mã giảm giá

 * /api/v1/admin/{ShopId}/discount/{AdminShopId}/detail/{DiscountId}:
 *   get:
 *     summary: Xem chi tiết mã giảm giá
 *     tags: [Discount]
 *     parameters:
 *       - in: path
 *         name: AdminShopId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: DiscountId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Chi tiết mã giảm giá

 * /api/v1/admin/{ShopId}/discount/update/{DiscountId}:
 *   patch:
 *     summary: Cập nhật mã giảm giá
 *     tags: [Discount]
 *     parameters:
 *       - in: path
 *         name: DiscountId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DiscountInput'
 *     responses:
 *       200:
 *         description: Cập nhật thành công

 * components:
 *   schemas:
 *     DiscountInput:
 *       type: object
 *       required: [name, code, type, value, StartDate, EndDate, productIds]
 *       properties:
 *         name:
 *           type: string
 *         code:
 *           type: string
 *         desc:
 *           type: string
 *         value:
 *           type: number
 *         type:
 *           type: string
 *           enum: [fixed, percentage]
 *         StartDate:
 *           type: string
 *           format: date-time
 *         EndDate:
 *           type: string
 *           format: date-time
 *         MinValueOrders:
 *           type: number
 *         MaxUses:
 *           type: number
 *         productIds:
 *           type: array
 *           items:
 *             type: string
 */


router.post(
  '/:AdminShopId',
  checkPermission('discount', 'create:any'),checkShopActive,
  asyncHandler(discountController.addDiscount)
);
router.get(
  '/all',
  checkPermission('discount', 'read:all'),checkShopActive,
  asyncHandler(discountController.listDiscounts)
);

router.get(
  '/:AdminShopId',
  checkPermission('discount', 'read:any'),checkShopActive,
  asyncHandler(discountController.listDiscounts)
);

router.get(
  '/:AdminShopId/detail/:DiscountId',
  checkPermission('discount', 'read:any'),checkShopActive,
  asyncHandler(discountController.getDiscountDetail));
router.patch(
  '/update/:DiscountId',
  checkPermission('discount', 'edit:any'),checkShopActive,
  asyncHandler(discountController.updateDiscount)
);

module.exports = router;
