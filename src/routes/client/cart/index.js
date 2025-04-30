const router = require("express").Router()
const {asyncHandler} = require("../../../helpers/asyncHandler")
const CartController = require("../../../controllers/Cart.Controller.js")
/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart operations
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *     responses:
 *       200:
 *         description: List of cart items
 *
 * /cart/add:
 *   post:
 *     summary: Add product to cart
 *     tags: [Cart]
 *     parameters:
 *       - in: query
 *         name: ProductId
 *         schema:
 *           type: integer
 *         required: true
 *       - in: query
 *         name: skuNo
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: quantity
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Product added
 *
 * /cart/update:
 *   put:
 *     summary: Update product quantity in cart
 *     tags: [Cart]
 *     parameters:
 *       - in: query
 *         name: ProductId
 *         schema:
 *           type: integer
 *         required: true
 *       - in: query
 *         name: skuNo
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: quantity
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Quantity updated
 *
 * /cart/remove:
 *   delete:
 *     summary: Remove a product from cart
 *     tags: [Cart]
 *     parameters:
 *       - in: query
 *         name: ProductId
 *         schema:
 *           type: integer
 *         required: true
 *       - in: query
 *         name: skuNo
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Product removed
 *
 * /cart/remove/product/all:
 *   delete:
 *     summary: Remove all products from cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: All products removed
 *
 * /cart/size:
 *   get:
 *     summary: Get total number of products in cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Total item count
 */
router.get("/", asyncHandler(CartController.getCart))
router.post("/add", asyncHandler(CartController.addProductToCart))
router.put("/update", asyncHandler(CartController.updateProductToCart))
router.delete("/remove/:productId", asyncHandler(CartController.removeProductFromCart))
router.delete("/remove/product/all", asyncHandler(CartController.removeAllProductFromCart))
router.get("/size", asyncHandler(CartController.getNumberOfProductInCart))
router.post("/checkout/data", asyncHandler(CartController.getCheckoutData));
router.post("/checkout/proceed", asyncHandler(CartController.proceedToPayment));
module.exports = router