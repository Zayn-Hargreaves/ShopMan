const router = require("express").Router();
const SearchController = require("../../../controllers/Search.Controller");
const ShopController = require("../../../controllers/Shop.Controller.js");
const { asyncHandler } = require("../../../helpers/asyncHandler.js");
const {optionalAuthentication, authentication} = require("../../../auth/authUtils.js")
/**
 * @swagger
 * /api/v1/shop/{slug}:
 *   get:
 *     summary: Lấy thông tin chi tiết cửa hàng
 *     description: Trả về thông tin cơ bản của cửa hàng theo slug
 *     tags: [Shop]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug của cửa hàng
 *     responses:
 *       200:
 *         description: Lấy thông tin shop thành công
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
 *         description: Không tìm thấy shop
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:slug", optionalAuthentication,asyncHandler(ShopController.getShopDetails));

/**
 * @swagger
 * /api/v1/shop/{slug}/product:
 *   get:
 *     summary: Lấy sản phẩm của cửa hàng
 *     description: Trả về danh sách sản phẩm thuộc cửa hàng (hỗ trợ lọc, phân trang, sắp xếp)
 *     tags: [Shop]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         description: Slug của cửa hàng
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Giá tối thiểu
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Giá tối đa
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: '{"field":"price","order":"asc"}'
 *         description: Sắp xếp kết quả theo trường
 *       - in: query
 *         name: lastSortValues
 *         schema:
 *           type: string
 *           example: '[299000, "abc123"]'
 *         description: Giá trị phân trang dạng search_after
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Số sản phẩm mỗi trang
 *       - in: query
 *         name: isAndroid
 *         schema:
 *           type: boolean
 *         description: Tối ưu dữ liệu cho client Android
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
 *         description: Không tìm thấy cửa hàng
 */
router.get("/:slug/product", asyncHandler(SearchController.getProductByShop));
router.get("/info/:ShopId",optionalAuthentication, asyncHandler(ShopController.getShopInfo))

router.use(authentication)
    
router.post("/:ShopId/follow", asyncHandler(ShopController.FollowShop))
router.delete("/:ShopId/follow", asyncHandler(ShopController.UnfollowShop))
module.exports = router;
