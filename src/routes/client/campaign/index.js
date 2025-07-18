const router = require("express").Router();
const { asyncHandler } = require("../../../helpers/asyncHandler");
const CampaignController = require("../../../controllers/client/Campaign.Controller.js");

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
 *     summary: Get campaign details by slug
 *     description: Returns basic campaign information and attached discount by slug.
 *     tags:
 *       - Campaign
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug of the campaign
 *     responses:
 *       200:
 *         description: Campaign detail retrieved successfully
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
 *                       description: Attached discount information (if any)
 *       404:
 *         description: Campaign not found or ended
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
 *     summary: Get products in a campaign
 *     description: Returns a paginated list of products belonging to the campaign slug.
 *     tags:
 *       - Campaign
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug of the campaign
 *       - in: query
 *         name: lastId
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID of the last product from previous page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of products per page
 *     responses:
 *       200:
 *         description: Product list retrieved successfully
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
 *         description: Campaign not found or no products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:slug/product", asyncHandler(CampaignController.getCampaignProduct));

module.exports = router;
