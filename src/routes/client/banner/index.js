const router = require("express").Router();
const { asyncHandler } = require("../../../helpers/asyncHandler");
const bannerController = require("../../../controllers/Banner.Controller");

/**
 * @swagger
 * tags:
 *   - name: Banner
 *     description: APIs for retrieving banners
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Banner:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         banner_type:
 *           type: string
 *           example: "homepage"
 *         title:
 *           type: string
 *           example: "Big Sale 50%"
 *         thumb:
 *           type: string
 *           example: "https://example.com/thumb.jpg"
 *         link_type:
 *           type: string
 *           example: "internal"
 *         link_target:
 *           type: string
 *           example: "/sale-off"
 *         position:
 *           type: integer
 *           example: 1
 *         start_time:
 *           type: string
 *           format: date-time
 *           example: "2025-04-25T00:00:00.000Z"
 *         end_time:
 *           type: string
 *           format: date-time
 *           example: "2025-05-01T23:59:59.000Z"
 *         priority:
 *           type: integer
 *           example: 10
 *         status:
 *           type: string
 *           example: "active"
 *         fee:
 *           type: number
 *           format: decimal
 *           example: 1000.00
 *         ShopId:
 *           type: integer
 *           nullable: true
 *           example: 5
 *         PartnerId:
 *           type: integer
 *           nullable: true
 *           example: 2
 *         CampaignId:
 *           type: integer
 *           nullable: true
 *           example: 3
 *         slug:
 *           type: string
 *           example: "big-sale-50"
 */

/**
 * @swagger
 * /api/v1/banner:
 *   get:
 *     summary: Get all active banners
 *     tags: [Banner]
 *     description: Get all banners with status "active" and current date between start_time and end_time.
 *     responses:
 *       200:
 *         description: List of active banners
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "get all banner success"
 *                 metadata:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Banner'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get("/", asyncHandler(bannerController.getAllBanner));

module.exports = router;
