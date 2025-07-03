const router = require("express").Router()
const { asyncHandler } = require("../../../helpers/asyncHandler")
const CartController = require("../../../controllers/Cart.Controller.js")

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   parameters:
 *     AccessTokenHeader:
 *       in: header
 *       name: Authorization
 *       required: true
 *       schema:
 *         type: string
 *         example: "Bearer <access_token>"
 *       description: "Access token để xác thực người dùng, định dạng: Bearer <access_token>"
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         ProductId:
 *           type: integer
 *           example: 101
 *         productName:
 *           type: string
 *           example: "Sữa rửa mặt dịu nhẹ"
 *         skuNo:
 *           type: string
 *           example: "SRM-001"
 *         quantity:
 *           type: integer
 *           example: 2
 *         price:
 *           type: number
 *           format: float
 *           example: 199000
 *         image:
 *           type: string
 *           example: "https://example.com/thumb.jpg"
 *         variant:
 *           type: object
 *           example: { color: "white", size: "200ml" }
 *         discounts:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 10
 *               name:
 *                 type: string
 *                 example: "Giảm 10%"
 *               value:
 *                 type: number
 *                 format: float
 *                 example: 10
 */

/**
 * @swagger
 * tags:
 *   - name: Cart
 *     description: "Các API cần access token (Authorization: Bearer <access_token>)"
 */

/**
 * @swagger
 * /api/v1/cart:
 *   get:
 *     summary: Get all items in cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/AccessTokenHeader'
 *     responses:
 *       200:
 *         description: List of cart items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "get cart success"
 *                 metadata:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CartItem'
 */

/**
 * @swagger
 * /api/v1/cart/add:
 *   post:
 *     summary: Add product to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/AccessTokenHeader'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ProductId, skuNo, quantity]
 *             properties:
 *               ProductId:
 *                 type: integer
 *                 example: 101
 *               skuNo:
 *                 type: string
 *                 example: "SRM-001"
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 */

/**
 * @swagger
 * /api/v1/cart/update:
 *   put:
 *     summary: Update product quantity in cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/AccessTokenHeader'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ProductId, skuNo, quantity]
 *             properties:
 *               ProductId:
 *                 type: integer
 *                 example: 101
 *               skuNo:
 *                 type: string
 *                 example: "SRM-001"
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Product quantity updated
 */

/**
 * @swagger
 * /api/v1/cart/remove/{ProductId}:
 *   delete:
 *     summary: Remove a product from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/AccessTokenHeader'
 *       - in: path
 *         name: ProductId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: skuNo
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product removed from cart
 */

/**
 * @swagger
 * /api/v1/cart/remove/product/all:
 *   delete:
 *     summary: Remove all products from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/AccessTokenHeader'
 *     responses:
 *       200:
 *         description: All products removed from cart
 */

/**
 * @swagger
 * /api/v1/cart/size:
 *   get:
 *     summary: Get number of products in cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/AccessTokenHeader'
 *     responses:
 *       200:
 *         description: Number of products in cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "get number of product in cart success"
 *                 metadata:
 *                   type: integer
 *                   example: 4
 */

router.get("/", asyncHandler(CartController.getCart))
router.post("/add", asyncHandler(CartController.addProductToCart))
router.put("/update", asyncHandler(CartController.updateProductToCart))
router.delete("/remove/:productId", asyncHandler(CartController.removeProductFromCart))
router.post("/remove/product/many", asyncHandler(CartController.removeAllProductFromCart))
router.get("/size", asyncHandler(CartController.getNumberOfProductInCart))

module.exports = router
