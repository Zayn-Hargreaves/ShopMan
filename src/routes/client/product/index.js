const router = require('express').Router();
const SearchController = require('../../../controllers/Search.Controller');
const { asyncHandler } = require('../../../helpers/asyncHandler');
const ProductController = require('../../../controllers/Product.Controller');

/**
 * @swagger
 * /api/v1/products/detail/{slug}:
 *   get:
 *     summary: Get product details by slug
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Product slug (e.g., summer-dress)
 *     responses:
 *       200:
 *         description: Product details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: get product detail successfully
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Summer Dress
 *                     desc:
 *                       type: string
 *                       example: <p>Beautiful summer dress</p>
 *                     desc_plain:
 *                       type: string
 *                       example: Beautiful summer dress
 *                     price:
 *                       type: number
 *                       format: float
 *                       example: 100.00
 *                     discount_percentage:
 *                       type: integer
 *                       example: 20
 *                     thumb:
 *                       type: string
 *                       example: https://example.com/dress.jpg
 *                     attrs:
 *                       type: object
 *                       example: { "material": "cotton" }
 *                     status:
 *                       type: string
 *                       example: active
 *                     slug:
 *                       type: string
 *                       example: summer-dress
 *                     CategoryId:
 *                       type: integer
 *                       example: 1
 *                     ShopId:
 *                       type: integer
 *                       example: 2
 *                     rating:
 *                       type: number
 *                       format: float
 *                       example: 4.5
 *                     sale_count:
 *                       type: integer
 *                       example: 50
 *                     has_variations:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-01T00:00:00Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-10T00:00:00Z
 *                     skus:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 101
 *                           sku_no:
 *                             type: string
 *                             example: SKU001
 *                           sku_name:
 *                             type: string
 *                             nullable: true
 *                             example: Red Dress Size S
 *                           sku_desc:
 *                             type: string
 *                             nullable: true
 *                             example: Red dress, size S
 *                           sku_type:
 *                             type: integer
 *                             nullable: true
 *                             example: 1
 *                           status:
 *                             type: string
 *                             example: active
 *                           sort:
 *                             type: integer
 *                             example: 1
 *                           sku_stock:
 *                             type: integer
 *                             example: 10
 *                           sku_price:
 *                             type: number
 *                             format: float
 *                             example: 95.00
 *                           sku_attrs:
 *                             type: object
 *                             example: { "color": "red", "size": "S" }
 *                           sku_specs:
 *                             type: object
 *                             example: { "weight": "500g", "dimensions": "20x30cm" }
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Product not found
 */
router.get('/detail/:slug', asyncHandler(ProductController.getProductDetail));

/**
 * @swagger
 * /api/v1/products/search:
 *   get:
 *     summary: Search products with filters and sorting
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search keyword (e.g., dress)
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           format: float
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           format: float
 *         description: Maximum price filter
 *       - in: query
 *         name: category
 *         schema:
 *           type: integer
 *         description: Category ID filter
 *       - in: query
 *         name: shop
 *         schema:
 *           type: integer
 *         description: Shop ID filter
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sorting field and order (JSON string, e.g., {"field":"price","order":"asc"})
 *       - in: query
 *         name: lastSortValues
 *         schema:
 *           type: string
 *         description: Last sort values for infinite scroll (JSON string, e.g., [100,"product_123"])
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Number of products per page
 *       - in: query
 *         name: isAndroid
 *         schema:
 *           type: boolean
 *         description: Whether the client is Android (affects description field)
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: get product list successfully
 *                 metadata:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductSummary'
 *                 total:
 *                   type: integer
 *                   example: 25
 *                 suggest:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["dress", "summer dress"]
 *                 lastSortValues:
 *                   type: array
 *                   items:
 *                     type: any
 *                   example: [150, "product_456"]
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: minPrice must be a non-negative number
 */
router.get('/search', asyncHandler(SearchController.SearchProducts));

/**
 * @swagger
 * /api/v1/products/category/{categoryId}:
 *   get:
 *     summary: Get products by category
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           format: float
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           format: float
 *         description: Maximum price filter
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sorting field and order (JSON string, e.g., {"field":"price","order":"asc"})
 *       - in: query
 *         name: lastSortValues
 *         schema:
 *           type: string
 *         description: Last sort values for infinite scroll (JSON string, e.g., [100,"product_123"])
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Number of products per page
 *       - in: query
 *         name: isAndroid
 *         schema:
 *           type: boolean
 *         description: Whether the client is Android
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: get product list by category successfully
 *                 metadata:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductSummary'
 *                 total:
 *                   type: integer
 *                   example: 15
 *                 lastSortValues:
 *                   type: array
 *                   items:
 *                     type: any
 *                   example: [4.8, "product_789"]
 *       400:
 *         description: Invalid query parameters
 */
router.get('/category/:categoryId', asyncHandler(SearchController.getProductByCategory));

/**
 * @swagger
 * /api/v1/products/shop/{shopId}:
 *   get:
 *     summary: Get products by shop
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shopId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Shop ID
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           format: float
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           format: float
 *         description: Maximum price filter
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sorting field and order (JSON string, e.g., {"field":"price","order":"asc"})
 *       - in: query
 *         name: lastSortValues
 *         schema:
 *           type: string
 *         description: Last sort values for infinite scroll (JSON string, e.g., [100,"product_123"])
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Number of products per page
 *       - in: query
 *         name: isAndroid
 *         schema:
 *           type: boolean
 *         description: Whether the client is Android
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: get product list by shop successfully
 *              
 *                 metadata:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductSummary'
 *                 total:
 *                   type: integer
 *                   example: 10
 *                 lastSortValues:
 *                   type: array
 *                   items:
 *                     type: any
 *                   example: [120, "product_999"]
 *       400:
 *         description: Invalid query parameters
 */
router.get('/shop/:shopId', asyncHandler(SearchController.getProductByShop));

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Get all products with filters and sorting
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           format: float
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           format: float
 *         description: Maximum price filter
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sorting field and order (JSON string, e.g., {"field":"price","order":"asc"})
 *       - in: query
 *         name: lastSortValues
 *         schema:
 *           type: string
 *         description: Last sort values for infinite scroll (JSON string, e.g., [100,"product_123"])
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Number of products per page
 *       - in: query
 *         name: isAndroid
 *         schema:
 *           type: boolean
 *         description: Whether the client is Android
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: get product list successfully
 *              
 *                 metadata:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductSummary'
 *                 total:
 *                   type: integer
 *                   example: 50
 *                 lastSortValues:
 *                   type: array
 *                   items:
 *                     type: any
 *                   example: ["2025-04-10T00:00:00Z", "product_111"]
 *       400:
 *         description: Invalid query parameters
 */
router.get('/', asyncHandler(SearchController.getProductList));

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductSummary:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Summer Dress
 *         desc:
 *           type: string
 *           example: <p>Beautiful summer dress</p>
 *         desc_plain:
 *           type: string
 *           example: Beautiful summer dress
 *         price:
 *           type: number
 *           format: float
 *           example: 100.00
 *         thumb:
 *           type: string
 *           example: https://example.com/dress.jpg
 *         rating:
 *           type: number
 *           format: float
 *           example: 4.5
 *         ShopId:
 *           type: integer
 *           example: 2
 *         CategoryId:
 *           type: integer
 *           example: 1
 *         sale_count:
 *           type: integer
 *           example: 50
 *         discount_percentage:
 *           type: integer
 *           example: 20
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-04-01T00:00:00Z
 *         score:
 *           type: number
 *           format: float
 *           example: 10.5
 *         sortValues:
 *           type: array
 *           items:
 *             type: any
 *           example: [100, "product_123"]
 */
router.get("/deal-of-the-day", asyncHandler(ProductController.getDealOfTheDay));
/**
 * @swagger
 * /api/v1/products/featured:
 *   get:
 *     summary: Get featured products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Featured products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: get featured products successfully
 *                 metadata:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductSummary'
 */
module.exports = router;