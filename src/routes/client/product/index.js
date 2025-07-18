const router = require('express').Router();
const SearchController = require('../../../controllers/client/Search.Controller');
const { asyncHandler } = require('../../../helpers/asyncHandler');
const ProductController = require('../../../controllers/client/Product.Controller');
const {optionalAuthentication, authentication} = require("../../../auth/authUtils");
const validate = require('../../../middlewares/validate.middleware');
const productSchemas = require('../../../middlewares/schemas/product.schema');
const commentSchemas = require('../../../middlewares/schemas/comment.schema');
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "product-123"
 *         name:
 *           type: string
 *           example: "Áo phông nam cao cấp"
 *         desc:
 *           type: string
 *           example: "Áo phông cotton 100% mềm mại, thấm hút mồ hôi tốt."
 *         desc_plain:
 *           type: string
 *           example: "Cotton 100% mềm mại."
 *         price:
 *           type: number
 *           example: 399000
 *         discount_percentage:
 *           type: integer
 *           example: 20
 *         thumb:
 *           type: string
 *           example: "https://example.com/images/product-thumb.jpg"
 *         rating:
 *           type: number
 *           format: float
 *           example: 4.7
 *         ShopId:
 *           type: integer
 *           example: 5
 *         CategoryId:
 *           type: integer
 *           example: 12
 *         sale_count:
 *           type: integer
 *           example: 150
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-04-26T10:00:00Z"
 *         slug:
 *           type: string
 *           example: "ao-phong-nam-cao-cap"
 *         categoryPath:
 *           type: array
 *           items:
 *             type: integer
 *           example: [1, 6, 7]
 */


/**
 * @swagger
 * /api/v1/product:
 *   get:
 *     summary: Lấy danh sách sản phẩm
 *     description: |
 *       API để lấy danh sách sản phẩm kèm theo bộ lọc giá, sắp xếp, phân trang.
 *       - Hỗ trợ infinite scroll (dùng `lastSortValues`)
 *       - Hỗ trợ chọn trường dữ liệu trả về phù hợp với client Android.
 *     tags:
 *       - Product
 *     parameters:
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Giá tối thiểu của sản phẩm
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Giá tối đa của sản phẩm
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: '{"field":"price","order":"asc"}'
 *         description: |
 *           Sắp xếp kết quả theo trường. Các giá trị field hợp lệ:
 *           - `price`
 *           - `rating`
 *           - `createdAt`
 *           - `sale_count`
 *           (Truyền dạng JSON string)
 *       - in: query
 *         name: lastSortValues
 *         schema:
 *           type: string
 *           example: '[500000, "abc123"]'
 *         description: |
 *           Giá trị search_after để lấy tiếp dữ liệu (infinite scroll).
 *           (Truyền dạng JSON array)
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số sản phẩm mỗi trang
 *       - in: query
 *         name: isAndroid
 *         schema:
 *           type: boolean
 *         description: Client có phải Android không (để tối ưu trường dữ liệu trả về)
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm lấy thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Get products list successfully
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *                     total:
 *                       type: integer
 *                       example: 200
 *                     suggest:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: []
 *                     lastSortValues:
 *                       type: array
 *                       example: [500000, "abc123"]
 *       500:
 *         description: Lỗi hệ thống
 */



router.get('/', asyncHandler(validate(productSchemas.dealOfTheDayQuery,'query')),asyncHandler(SearchController.getProductList));

/**
 * @swagger
 * /api/v1/product/detail/{slug}:
 *   get:
 *     summary: Lấy chi tiết sản phẩm
 *     description: |
 *       API lấy thông tin chi tiết 1 sản phẩm theo slug.
 *       - Bao gồm thông tin cơ bản + SKU + thuộc tính SKU nếu có
 *       - Nếu có user đăng nhập, sẽ kiểm tra thêm sản phẩm có trong wishlist không (`isInWishlist`)
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug của sản phẩm cần lấy chi tiết
 *     responses:
 *       200:
 *         description: Lấy thành công chi tiết sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "get product detail success"
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Áo sơ mi nam cao cấp"
 *                     slug:
 *                       type: string
 *                       example: "ao-so-mi-nam-cao-cap"
 *                     desc:
 *                       type: string
 *                       example: "Áo sơ mi nam chất liệu cotton cao cấp, form slimfit"
 *                     price:
 *                       type: number
 *                       example: 599000
 *                     discount_percentage:
 *                       type: integer
 *                       example: 20
 *                     thumb:
 *                       type: string
 *                       example: "https://example.com/thumb.jpg"
 *                     rating:
 *                       type: number
 *                       format: float
 *                       example: 4.8
 *                     sale_count:
 *                       type: integer
 *                       example: 200
 *                     has_variations:
 *                       type: boolean
 *                       example: true
 *                     SpuToSkus:
 *                       type: array
 *                       description: Nếu sản phẩm có biến thể (SKU)
 *                       items:
 *                         type: object
 *                         properties:
 *                           Sku:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 1
 *                               sku_name:
 *                                 type: string
 *                                 example: "Áo trắng size M"
 *                               sku_price:
 *                                 type: number
 *                                 example: 599000
 *                               SkuAttr:
 *                                 type: object
 *                                 description: Các thuộc tính SKU
 *                                 properties:
 *                                   colors:
 *                                     type: array
 *                                     items:
 *                                       type: string
 *                                     example: ["Trắng"]
 *                                   sizes:
 *                                     type: array
 *                                     items:
 *                                       type: string
 *                                     example: ["M"]
 *                               SkuSpecs:
 *                                 type: object
 *                                 description: Các thông số kỹ thuật SKU
 *                                 example: { "chất liệu": "Cotton", "kiểu dáng": "Slimfit" }
 *                     isInWishlist:
 *                       type: boolean
 *                       example: true
 *                       description: Chỉ có nếu user đã đăng nhập
 *       404:
 *         description: Không tìm thấy sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "product not found"
 *       500:
 *         description: Lỗi hệ thống
 */


router.get('/detail/:slug', optionalAuthentication,asyncHandler(validate(productSchemas.productSlugParam,"params")),asyncHandler(ProductController.getProductDetail));

/**
 * @swagger
 * /api/v1/product/search:
 *   get:
 *     summary: Tìm kiếm sản phẩm
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm
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
 *         name: CategoryId
 *         schema:
 *           type: integer
 *         description: ID danh mục
 *       - in: query
 *         name: ShopId
 *         schema:
 *           type: integer
 *         description: ID cửa hàng
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: '{"field":"price","order":"asc"}'
 *         description: Sắp xếp theo field
 *       - in: query
 *         name: lastSortValues
 *         schema:
 *           type: string
 *           example: '[500000, "abc123"]'
 *         description: Search after value cho infinite scroll
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Số sản phẩm mỗi trang
 *       - in: query
 *         name: isAndroid
 *         schema:
 *           type: boolean
 *         description: Dành cho client Android
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm tìm được
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Search products successfully
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *                     total:
 *                       type: integer
 *                       example: 120
 *                     suggest:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["áo sơ mi", "áo thun"]
 *                     lastSortValues:
 *                       type: array
 *                       example: [500000, "abc123"]
 *       400:
 *         description: Tham số không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/v1/product/deal-of-the-day:
 *   get:
 *     summary: Get deal of the day products
 *     description: Retrieve products with the best deals, sorted and filtered.
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: '{"field":"price","order":"asc"}'
 *       - in: query
 *         name: lastSortValues
 *         schema:
 *           type: string
 *           example: '[500000, "abc123"]'
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: isAndroid
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Deals retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "OK"
 *               status: 200
 *               metadata:
 *                 message: "Get deal of the day successfull"
 *                 metadata:
 *                   data: [...]
 *                   total: 318
 *                   suggest: []
 *                   lastSortValues: [24.34, "products+0+825"]
 */

/**
 * @swagger
 * /api/v1/product/trending-products:
 *   get:
 *     summary: Get trending products
 *     description: Retrieve trending products by cursor score.
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: cursorScore
 *         schema:
 *           type: string
 *           example: "39.6"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Trending products retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "OK"
 *               status: 200
 *               metadata:
 *                 message: "get trending products by cursor success"
 *                 metadata:
 *                   products: [...]
 *                   nextCursor: 12.8
 */

/**
 * @swagger
 * /api/v1/product/new-arrivals:
 *   get:
 *     summary: Get newly arrived products
 *     description: Retrieve newly added products for display.
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: New arrivals retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "OK"
 *               status: 200
 *               metadata:
 *                 message: "Get new arrval products successfully"
 *                 metadata:
 *                   data: [...]
 *                   total: 318
 *                   suggest: []
 *                   lastSortValues: [1750585133415, "products+0+612"]
 */

/**
 * @swagger
 * /api/v1/product/{productId}/comments:
 *   get:
 *     summary: Get root comments of a product
 *     description: Fetch top-level comments for a specific product.
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *           format: date-time
 *         required: false
 *         description: Pagination cursor
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *         description: Number of comments to fetch
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "OK"
 *               status: 200
 *               metadata:
 *                 message: "get comment success"
 *                 metadata:
 *                   totalItems: 1
 *                   comments: [...]
 *                   nextCursor: null
 */

/**
 * @swagger
 * /api/v1/product/{productId}/comments:
 *   post:
 *     summary: Post a comment on a product
 *     description: Submit a new comment for a product, including optional images and rating.
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               parentId:
 *                 type: integer
 *               image_urls:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *             example:
 *               content: "Great product!"
 *               rating: 5
 *               parentId: null
 *               image_urls: ["https://example.com/img1.jpg"]
 *     responses:
 *       200:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "OK"
 *               status: 200
 *               metadata:
 *                 message: "create comment success"
 *                 metadata: { ... }
 */

/**
 * @swagger
 * /api/v1/product/{productId}/skus:
 *   get:
 *     summary: Get SKUs for a product
 *     description: Fetch all SKU variants for a product including attributes and specs.
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product
 *     responses:
 *       200:
 *         description: SKUs retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "OK"
 *               status: 200
 *               metadata:
 *                 message: "get product sku success"
 *                 metadata: [...]
 */

/**
 * @swagger
 * /api/v1/product/{ProductId}/discounts:
 *   get:
 *     summary: Get discounts for a product
 *     description: Retrieve applicable discount campaigns for a product.
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: ProductId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product
 *     responses:
 *       200:
 *         description: Discounts retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "OK"
 *               status: 200
 *               metadata:
 *                 message: "get Product discount success"
 *                 metadata: [...]
 */


router.get('/search', asyncHandler(validate(productSchemas.dealOfTheDayQuery,'params')),asyncHandler(SearchController.SearchProducts));

router.get("/deal-of-the-day",asyncHandler(validate(productSchemas.dealOfTheDayQuery,'query')), asyncHandler(ProductController.getDealOfTheDay));


router.get("/trending-products", asyncHandler(validate(productSchemas.trendingQuery,'query')),asyncHandler(ProductController.getTrendingProducts));

router.get("/new-arrivals", asyncHandler(validate(productSchemas.newArrivals)),asyncHandler(ProductController.getNewArrivals));

router.get("/:productId/comments", optionalAuthentication,asyncHandler(validate(commentSchemas.getRootCommentsQuery)),asyncHandler(ProductController.GetRootComment))

router.post("/:productId/comments", authentication, asyncHandler(validate(commentSchemas.createCommentBody)),asyncHandler(ProductController.CreateComment))

router.get("/:productId/skus", asyncHandler(validate(productSchemas.productIdParam,'params')),asyncHandler(ProductController.getProductSkus))
router.get("/:ProductId/discounts",asyncHandler(validate(productSchemas.productIdDiscountParam,'params')) ,asyncHandler(ProductController.getDiscountOfProduct))
module.exports = router;