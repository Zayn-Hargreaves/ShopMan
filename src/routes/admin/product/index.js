const { checkShop, checkPermission, checkShopActive } = require("../../../auth/authUtils");
const productController = require('../../../controllers/admin/product.controller');
const { asyncHandler } = require('../../../helpers/asyncHandler');
const router = require('express').Router();


/**
 * @swagger
 * tags:
 *   - name: Admin - Shop Products
 *     description: API quản lý sản phẩm trong cửa hàng

 * components:
 *   schemas:
 *     ProductInput:
 *       type: object
 *       required: [name, price, CategoryId]
 *       properties:
 *         name:
 *           type: string
 *           example: Kem dưỡng ẩm
 *         price:
 *           type: number
 *           example: 150000
 *         desc:
 *           type: string
 *           example: Dưỡng ẩm sâu, lành tính
 *         CategoryId:
 *           type: integer
 *           example: 2
 *         attrs:
 *           type: object
 *           example: { brand: "La Roche-Posay", origin: "Pháp" }
 *         discount_percentage:
 *           type: number
 *           example: 10
 *         thumb:
 *           type: string
 *           example: "https://example.com/image.jpg"
 *         skus:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               sku_name:
 *                 type: string
 *               sku_price:
 *                 type: number
 *               sku_stock:
 *                 type: integer
 *               sku_attrs:
 *                 type: object
 *                 example: { size: "S", color: "White" }

 *     ProductUpdate:
 *       allOf:
 *         - $ref: '#/components/schemas/ProductInput'

 *     ProductResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         status:
 *           type: string
 *         CategoryId:
 *           type: integer
 */

/**
 * @swagger
 * /api/v1/admin/{ShopId}shop/{AdminShopId}/product/all:
 *   get:
 *     tags: [Admin - Shop Products]
 *     summary: Lấy danh sách tất cả sản phẩm trong shop (có lọc/phân trang)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ShopId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: AdminShopId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: name
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm
 */

/**
 * @swagger
 * /api/v1/admin/{ShopId}shop/{AdminShopId}/product:
 *   post:
 *     tags: [Admin - Shop Products]
 *     summary: Tạo sản phẩm mới
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ShopId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: AdminShopId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Tạo sản phẩm thành công
 */

/**
 * @swagger
 * /api/v1/admin/{ShopId}shop/{AdminShopId}/product/{productId}:
 *   put:
 *     tags: [Admin - Shop Products]
 *     summary: Cập nhật sản phẩm
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ShopId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: AdminShopId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductUpdate'
 *     responses:
 *       200:
 *         description: Cập nhật sản phẩm thành công
 */

/**
 * @swagger
 * /api/v1/admin/{ShopId}shop/{AdminShopId}/product/{productId}:
 *   delete:
 *     tags: [Admin - Shop Products]
 *     summary: Xoá sản phẩm
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ShopId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: AdminShopId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Xoá sản phẩm thành công
 */

/**
 * @swagger
 * /api/v1/admin/{ShopId}shop/{AdminShopId}/product/productdetail/{ProductId}:
 *   get:
 *     tags: [Admin - Shop Products]
 *     summary: Lấy chi tiết sản phẩm
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ShopId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: AdminShopId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: ProductId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Trả về thông tin sản phẩm
 */



router.get('/all',
    checkPermission('product', 'read:all'),checkShopActive,
    asyncHandler(productController.listProducts)
);

router.get('/:AdminShopId',
    checkPermission('product', 'read:any'),checkShopActive,
    asyncHandler(productController.listProducts)
);

router.get("/:AdminShopId/productdetail/:ProductId",checkPermission("product","read:any"), checkShopActive,asyncHandler(productController.getProductDetail))
router.post('/:AdminShopId',
    checkPermission('product', 'create:any'),checkShopActive,
    asyncHandler(productController.addProduct)
);

router.put('/:AdminShopId/:productId',
    checkPermission('product', 'update:any'),checkShopActive,
    asyncHandler(productController.updateProduct)
);

router.delete('/:AdminShopId/:productId',
    checkPermission('product', 'delete:any'),checkShopActive,
    asyncHandler(productController.deleteProduct)
);

module.exports = router;
