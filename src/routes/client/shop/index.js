const router = require("express").Router();
const SearchController = require("../../../controllers/client/Search.Controller");
const ShopController = require("../../../controllers/client/Shop.Controller.js");
const { asyncHandler } = require("../../../helpers/asyncHandler.js");
const { optionalAuthentication, authentication } = require("../../../auth/authUtils.js")

/**
 * @swagger
 * /api/v1/shop/{slug}:
 *   get:
 *     summary: Get shop details
 *     description: Returns shop information by slug
 *     tags: [Shop]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Shop slug
 *     responses:
 *       200:
 *         description: Get shop detail success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: get shop detail success
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Shop Thời Trang ABC"
 *                     slug:
 *                       type: string
 *                       example: "shop-thoi-trang-abc"
 *                     avatar:
 *                       type: string
 *                       example: "https://example.com/avatar.jpg"
 *                     banner:
 *                       type: string
 *                       example: "https://example.com/banner.jpg"
 *                     description:
 *                       type: string
 *                       example: "Chuyên đồ unisex chính hãng"
 *       404:
 *         description: Shop not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:slug", optionalAuthentication, asyncHandler(ShopController.getShopDetails));

/**
 * @swagger
 * /api/v1/shop/{slug}/product:
 *   get:
 *     summary: Get shop products
 *     description: Returns product list for a shop with filters, sorting, and pagination
 *     tags: [Shop]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         description: Shop slug
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: '{"field":"price","order":"asc"}'
 *         description: Sort field and order
 *       - in: query
 *         name: lastSortValues
 *         schema:
 *           type: string
 *           example: '[299000, "abc123"]'
 *         description: Pagination cursor value (search_after)
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: isAndroid
 *         schema:
 *           type: boolean
 *         description: Optimize response for Android client
 *     responses:
 *       200:
 *         description: Get shop products successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Get shop products successfully
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *                     total:
 *                       type: integer
 *                     suggest:
 *                       type: array
 *                       items:
 *                         type: string
 *                     lastSortValues:
 *                       type: array
 *                       example: [299000, "abc123"]
 *       404:
 *         description: Shop not found
 */
router.get("/:slug/product", asyncHandler(SearchController.getProductByShop));

/**
 * @swagger
 * /api/v1/shop/info/{ShopId}:
 *   get:
 *     summary: Get shop info by ID
 *     description: Returns shop info and follow status
 *     tags: [Shop]
 *     parameters:
 *       - in: path
 *         name: ShopId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the shop
 *     responses:
 *       200:
 *         description: Shop info fetched successfully
 *       404:
 *         description: Shop not found
 */
router.get("/info/:ShopId", optionalAuthentication, asyncHandler(ShopController.getShopInfo))

/**
 * @swagger
 * /api/v1/shop/{ShopId}/follow:
 *   post:
 *     summary: Follow a shop
 *     description: Authenticated user follows the shop
 *     tags: [Shop]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ShopId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Shop ID to follow
 *     responses:
 *       200:
 *         description: Shop followed successfully
 *       404:
 *         description: Shop not found
 */
router.post("/:ShopId/follow", authentication, asyncHandler(ShopController.FollowShop))

/**
 * @swagger
 * /api/v1/shop/{ShopId}/follow:
 *   delete:
 *     summary: Unfollow a shop
 *     description: Authenticated user unfollows the shop
 *     tags: [Shop]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ShopId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Shop ID to unfollow
 *     responses:
 *       200:
 *         description: Shop unfollowed successfully
 *       404:
 *         description: Shop not found
 */
router.delete("/:ShopId/follow", authentication, asyncHandler(ShopController.UnfollowShop))

module.exports = router;
