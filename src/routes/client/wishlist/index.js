const router = require("express").Router();
const { asyncHandler } = require("../../../helpers/asyncHandler");
const wishlistController = require("../../../controllers/Wishlist.Controller.js");

router.get("/", asyncHandler(wishlistController.getProductInWishlist));
/**
 * @swagger
 * /api/v1/wishlist:
 *   get:
 *     summary: Get all products in wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: get product in wishlist success
 *                 metadata:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.post("/", asyncHandler(wishlistController.addProductToWishlist));
/**
 * @swagger
 * /api/v1/wishlist:
 *   post:
 *     summary: Add product to wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Product added to wishlist successfully
 */
router.delete("/:productId", asyncHandler(wishlistController.removeProductFromWishlist));
/**
 * @swagger
 * /api/v1/wishlist:
 *   delete:
 *     summary: Remove product from wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Product removed from wishlist successfully
 */
router.delete("/all", asyncHandler(wishlistController.removeAllProductFromWishlist));
/**
 * @swagger
 * /api/v1/wishlist/all:
 *   delete:
 *     summary: Remove all products from wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All products removed from wishlist successfully
 */
router.get("/count", asyncHandler(wishlistController.getCountProductInWishlist));
/**
 * @swagger
 * /api/v1/wishlist/count:
 *   get:
 *     summary: Get count of products in wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Count of products in wishlist retrieved successfully
 */

module.exports = router;
