const router = require("express").Router()
const {asyncHandler} = require("../../../helpers/asyncHandler")
const CartController = require("../../../controllers/Cart.Controller.js")
/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         productId:
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

 * tags:
 *   - name: Cart
 *     description: Cart management APIs
 */

/**
 * @swagger
 * /api/v1/cart:
 *   get:
 *     summary: Get all items in cart
 *     tags: [Cart]
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
 *     parameters:
 *       - in: query
 *         name: ProductId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: skuNo
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: quantity
 *         required: true
 *         schema:
 *           type: integer
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
 *     parameters:
 *       - in: query
 *         name: ProductId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: skuNo
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: quantity
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product quantity updated
 */

/**
 * @swagger
 * /api/v1/cart/remove/{productId}:
 *   delete:
 *     summary: Remove a product from cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: productId
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
router.delete("/remove/product/all", asyncHandler(CartController.removeAllProductFromCart))
router.get("/size", asyncHandler(CartController.getNumberOfProductInCart))

module.exports = router