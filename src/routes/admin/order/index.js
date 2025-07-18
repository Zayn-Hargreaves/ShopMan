const router = require('express').Router();
const { checkShop, checkPermission, checkShopActive } = require("../../../auth/authUtils");
const orderController = require("../../../controllers/admin/order.controller");
const { asyncHandler } = require("../../../helpers/asyncHandler");

/**
 * @swagger
 * tags:
 *   - name: Admin - Order
 *     description: Quản lý đơn hàng của shop theo quyền admin
 */

/**
 * @swagger
 * /api/v1/admin/{ShopId}/order/all:
 *   get:
 *     summary: Lấy danh sách tất cả đơn hàng theo shop (dành cho super admin)
 *     tags: [Admin - Order]
 *     parameters:
 *       - in: path
 *         name: ShopId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của shop
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Trạng thái đơn hàng (optional)
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: ID người mua (optional)
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *         description: Từ ngày (yyyy-mm-dd)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *         description: Đến ngày (yyyy-mm-dd)
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Trang (mặc định 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Số lượng mỗi trang (mặc định 20)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
 */
router.get(
  '/all',
  checkPermission('order', 'read:all'),
  checkShopActive,
  asyncHandler(orderController.listOrders)
);

/**
 * @swagger
 * /api/v1/admin/{ShopId}/order/{AdminShopId}:
 *   get:
 *     summary: Lấy danh sách đơn hàng theo admin shop cụ thể
 *     tags: [Admin - Order]
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
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
 */
router.get(
  '/:AdminShopId',
  checkPermission('order', 'read:any'),
  checkShopActive,
  asyncHandler(orderController.listOrders)
);

/**
 * @swagger
 * /api/v1/admin/{ShopId}/order/{AdminShopId}/detail/{orderDetailId}:
 *   get:
 *     summary: Lấy chi tiết đơn hàng
 *     tags: [Admin - Order]
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
 *           type: string
 *       - in: path
 *         name: orderDetailId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chi tiết đơn hàng
 */
router.get(
  '/:AdminShopId/detail/:orderDetailId',
  checkPermission('order', 'read:any'),
  checkShopActive,
  asyncHandler(orderController.getOrder)
);

/**
 * @swagger
 * /api/v1/admin/{ShopId}/order/{AdminShopId}/change-status/{orderDetailId}:
 *   patch:
 *     summary: Cập nhật trạng thái đơn hàng
 *     tags: [Admin - Order]
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
 *           type: string
 *       - in: path
 *         name: orderDetailId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: shipping
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.patch(
  '/:AdminShopId/change-status/:orderDetailId',
  checkPermission('order', 'update:any'),
  checkShopActive,
  asyncHandler(orderController.updateOrderStatus)
);

module.exports = router;
