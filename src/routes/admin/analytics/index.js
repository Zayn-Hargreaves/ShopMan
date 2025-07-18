const { checkShopActive } = require('../../../auth/authUtils');
const analyticsController = require('../../../controllers/admin/analytics.controller');
const { asyncHandler } = require('../../../helpers/asyncHandler');

const router = require('express').Router();

/**
 * @swagger
 * tags:
 *   - name: Analytics
 *     description: Báo cáo phân tích doanh thu, đơn hàng, sản phẩm theo cửa hàng
 *
 * /api/v1/admin/{ShopId}/analytics/revenue/{AdminShopId}:
 *   get:
 *     summary: Lấy thống kê doanh thu theo ngày/tuần/tháng
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: AdminShopId
 *         required: false
 *         schema:
 *           type: string
 *         description: ID của shop (superadmin dùng để xem shop bất kỳ)
 *       - in: query
 *         name: interval
 *         schema:
 *           type: string
 *           enum: [day, week, month]
 *         description: Khoảng thời gian phân tích
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày bắt đầu (YYYY-MM-DD)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày kết thúc (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Dữ liệu doanh thu theo thời gian
 *
 * /api/v1/admin/{ShopId}/analytics/order-status/{AdminShopId}:
 *   get:
 *     summary: Thống kê số lượng đơn theo trạng thái
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: AdminShopId
 *         required: false
 *         schema:
 *           type: string
 *         description: ID của shop
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày bắt đầu (YYYY-MM-DD)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày kết thúc (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Danh sách trạng thái đơn hàng và số lượng
 *
 * /api/v1/admin/{ShopId}/analytics/top-products/{AdminShopId}:
 *   get:
 *     summary: Top sản phẩm bán chạy
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: AdminShopId
 *         required: false
 *         schema:
 *           type: string
 *         description: ID của shop
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày bắt đầu (YYYY-MM-DD)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày kết thúc (YYYY-MM-DD)
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *         description: "Số lượng sản phẩm cần lấy (default: 10)"
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm top bán chạy kèm doanh thu
 */

router.get('/revenue/:AdminShopId?', checkShopActive,asyncHandler(analyticsController.getRevenue));
router.get('/order-status/:AdminShopId?', checkShopActive,asyncHandler(analyticsController.getOrderStatus));
router.get('/top-products/:AdminShopId?', checkShopActive,asyncHandler(analyticsController.getTopProducts));

module.exports = router;






// module.exports = router

