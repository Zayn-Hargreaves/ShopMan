const router = require("express").Router();
const { asyncHandler } = require("../../../helpers/asyncHandler");
const CampaignController = require("../../../controllers/Campaign.Controller.js");

/**
 * @swagger
 * components:
 *   schemas:
 *     Campaign:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Giảm Giá Tháng 5"
 *         slug:
 *           type: string
 *           example: "giam-gia-thang-5"
 *         description:
 *           type: string
 *           example: "Ưu đãi khủng cho tháng 5"
 *         start_time:
 *           type: string
 *           format: date-time
 *           example: "2025-05-01T00:00:00.000Z"
 *         end_time:
 *           type: string
 *           format: date-time
 *           example: "2025-05-31T23:59:59.000Z"
 */

/**
 * @swagger
 * /api/v1/campaign/{slug}:
 *   get:
 *     summary: Lấy chi tiết chiến dịch khuyến mãi
 *     description: Trả về thông tin cơ bản về campaign và discount đính kèm theo slug chiến dịch.
 *     tags:
 *       - Campaign
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug của chiến dịch khuyến mãi
 *     responses:
 *       200:
 *         description: Lấy thông tin campaign thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "get campaign detail success"
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     campaign:
 *                       $ref: '#/components/schemas/Campaign'
 *                     discount:
 *                       type: object
 *                       description: Thông tin discount đính kèm (nếu có)
 *       404:
 *         description: Không tìm thấy campaign hoặc đã kết thúc
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:slug", asyncHandler(CampaignController.getCampaignDetails));

/**
 * @swagger
 * /api/v1/campaign/{slug}/product:
 *   get:
 *     summary: Lấy danh sách sản phẩm thuộc campaign
 *     description: Lấy danh sách sản phẩm theo slug chiến dịch, có phân trang.
 *     tags:
 *       - Campaign
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug của chiến dịch
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Số sản phẩm mỗi trang
 *     responses:
 *       200:
 *         description: Lấy danh sách sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "get product campaign success"
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       example: 50
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1001
 *                           name:
 *                             type: string
 *                             example: "Áo thun Unisex Sale 50%"
 *                           price:
 *                             type: number
 *                             example: 299000
 *                           discount_percentage:
 *                             type: integer
 *                             example: 50
 *                           thumb:
 *                             type: string
 *                             example: "https://example.com/product-image.jpg"
 *                           rating:
 *                             type: number
 *                             example: 4.8
 *                           sale_count:
 *                             type: integer
 *                             example: 20
 *       404:
 *         description: Không tìm thấy campaign hoặc không có sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:slug/product", asyncHandler(CampaignController.getCampaignProduct));

module.exports = router;