const router = require('express').Router();
const SearchController = require('../../../controllers/Search.Controller');
const { asyncHandler } = require('../../../helpers/asyncHandler');
const ProductController = require('../../../controllers/Product.Controller');
const {optionalAuthentication} = require("../../../auth/authUtils")
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



router.get('/', asyncHandler(SearchController.getProductList));

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


router.get('/detail/:slug', optionalAuthentication,asyncHandler(ProductController.getProductDetail));

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


router.get('/search', asyncHandler(SearchController.SearchProducts));

/**
 * @swagger
 * /api/v1/deal-of-the-day:
 *   get:
 *     summary: Lấy danh sách Deal Of The Day
 *     description: |
 *       Lấy các sản phẩm đang được khuyến mãi nổi bật trong ngày. 
 *       Ưu tiên các sản phẩm có lượt bán cao và còn số lượng khuyến mãi khả dụng.
 *     tags:
 *       - Product
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Trang hiện tại
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Số sản phẩm mỗi trang
 *     responses:
 *       200:
 *         description: Lấy danh sách sản phẩm khuyến mãi thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "get deal of the day success"
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       example: 30
 *                     totalPages:
 *                       type: integer
 *                       example: 3
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
 *                             example: 101
 *                           name:
 *                             type: string
 *                             example: "Áo thun tay lỡ unisex"
 *                           slug:
 *                             type: string
 *                             example: "ao-thun-unisex"
 *                           price:
 *                             type: number
 *                             example: 350000
 *                           discount_percentage:
 *                             type: number
 *                             example: 30
 *                           rating:
 *                             type: number
 *                             example: 4.6
 *                           sale_count:
 *                             type: integer
 *                             example: 120
 *                           thumb:
 *                             type: string
 *                             example: "https://example.com/image.jpg"
 *                           discounts:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                   example: 5
 *                                 name:
 *                                   type: string
 *                                   example: "Flash Sale 30%"
 *                                 value:
 *                                   type: number
 *                                   example: 30
 *                                 type:
 *                                   type: string
 *                                   example: "percentage"
 *                                 MaxUses:
 *                                   type: integer
 *                                   example: 100
 *                                 UserCounts:
 *                                   type: integer
 *                                   example: 25
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Internal server error"
 */

router.get("/deal-of-the-day", asyncHandler(ProductController.getDealOfTheDay));

/**
 * @swagger
 * /api/v1/all-deal-product:
 *   get:
 *     summary: Lấy toàn bộ sản phẩm đang được khuyến mãi
 *     description: Trả về tất cả các sản phẩm đang có khuyến mãi đang hoạt động (theo ngày, trạng thái và số lượng).
 *     tags:
 *       - Product
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Trang hiện tại (bắt đầu từ 1)
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 20
 *         description: Số sản phẩm mỗi trang
 *     responses:
 *       200:
 *         description: Lấy danh sách sản phẩm khuyến mãi thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "get all deal product success"
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       example: 50
 *                     totalPages:
 *                       type: integer
 *                       example: 3
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
 *                             example: 102
 *                           name:
 *                             type: string
 *                             example: "Quần short nam vải đũi"
 *                           slug:
 *                             type: string
 *                             example: "quan-short-nam-vai-dui"
 *                           price:
 *                             type: number
 *                             example: 250000
 *                           discount_percentage:
 *                             type: number
 *                             example: 15
 *                           rating:
 *                             type: number
 *                             example: 4.8
 *                           sale_count:
 *                             type: integer
 *                             example: 85
 *                           thumb:
 *                             type: string
 *                             example: "https://example.com/thumb.jpg"
 *                           discounts:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                   example: 12
 *                                 name:
 *                                   type: string
 *                                   example: "Summer Sale"
 *                                 type:
 *                                   type: string
 *                                   example: "percentage"
 *                                 value:
 *                                   type: number
 *                                   example: 15
 *                                 StartDate:
 *                                   type: string
 *                                   format: date-time
 *                                   example: "2025-04-01T00:00:00Z"
 *                                 EndDate:
 *                                   type: string
 *                                   format: date-time
 *                                   example: "2025-05-01T00:00:00Z"
 *       500:
 *         description: Lỗi hệ thống khi truy vấn sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Internal server error"
 */


router.get("/all-deal-product", asyncHandler(ProductController.getAllDealProduct))
/**
 * @swagger
 * /api/v1/trending-products:
 *   get:
 *     summary: Lấy danh sách sản phẩm thịnh hành nhất trong ngày
 *     description: Trả về danh sách top sản phẩm trending dựa theo lượt xem & lượt mua, được tính toán và lưu trên Redis mỗi ngày.
 *     tags:
 *       - Product
 *     responses:
 *       200:
 *         description: Lấy danh sách sản phẩm trending thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "get trending products success"
 *                 metadata:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 123
 *                       name:
 *                         type: string
 *                         example: "Áo hoodie unisex mùa đông"
 *                       slug:
 *                         type: string
 *                         example: "ao-hoodie-unisex-mua-dong"
 *                       price:
 *                         type: number
 *                         example: 299000
 *                       discount_percentage:
 *                         type: integer
 *                         example: 20
 *                       rating:
 *                         type: number
 *                         example: 4.7
 *                       sale_count:
 *                         type: integer
 *                         example: 100
 *                       thumb:
 *                         type: string
 *                         example: "https://example.com/thumb.jpg"
 *       500:
 *         description: Lỗi khi truy vấn sản phẩm trending
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Internal server error"
 */

router.get("/trending-products", asyncHandler(ProductController.getTrendingProducts));
/**
 * @swagger
 * /api/v1/all-trending-products:
 *   get:
 *     summary: Lấy danh sách tất cả sản phẩm thịnh hành (phân trang)
 *     description: Truy vấn toàn bộ sản phẩm trending dựa theo điểm số đã tính toán trong Redis, có hỗ trợ phân trang.
 *     tags:
 *       - Product
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Số trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Số sản phẩm trên mỗi trang
 *     responses:
 *       200:
 *         description: Lấy danh sách sản phẩm trending thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "get all trending product sucess"
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       example: 45
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
 *                             example: 123
 *                           name:
 *                             type: string
 *                             example: "Áo phông oversize hot trend"
 *                           slug:
 *                             type: string
 *                             example: "ao-phong-oversize-hot-trend"
 *                           price:
 *                             type: number
 *                             example: 199000
 *                           discount_percentage:
 *                             type: integer
 *                             example: 15
 *                           rating:
 *                             type: number
 *                             example: 4.5
 *                           sale_count:
 *                             type: integer
 *                             example: 50
 *                           thumb:
 *                             type: string
 *                             example: "https://example.com/image.jpg"
 *       500:
 *         description: Lỗi khi truy vấn danh sách trending
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Internal server error"
 */

router.get('/all-trending-products', asyncHandler(ProductController.getAllTrendingProducts))
/**
 * @swagger
 * /api/v1/new-arrivals:
 *   get:
 *     summary: Lấy danh sách sản phẩm mới nhất
 *     description: Lấy danh sách các sản phẩm vừa mới đăng, mới nhập kho, sắp xếp theo thời gian tạo mới nhất (createdAt giảm dần).
 *     tags:
 *       - Product
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Số trang cần lấy
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Số lượng sản phẩm trên mỗi trang
 *     responses:
 *       200:
 *         description: Lấy danh sách sản phẩm mới thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "get new arrivals success"
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       example: 100
 *                     totalPages:
 *                       type: integer
 *                       example: 10
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
 *                             example: 101
 *                           name:
 *                             type: string
 *                             example: "Áo Hoodie Mùa Đông 2025"
 *                           slug:
 *                             type: string
 *                             example: "ao-hoodie-mua-dong-2025"
 *                           price:
 *                             type: number
 *                             example: 450000
 *                           discount_percentage:
 *                             type: integer
 *                             example: 20
 *                           thumb:
 *                             type: string
 *                             example: "https://example.com/product-image.jpg"
 *                           rating:
 *                             type: number
 *                             example: 4.7
 *                           sale_count:
 *                             type: integer
 *                             example: 5
 *       500:
 *         description: Lỗi khi lấy danh sách sản phẩm mới
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Internal server error"
 */

router.get("/new-arrivals", asyncHandler(ProductController.getNewArrivals));


module.exports = router;