const router = require("express").Router();
const { asyncHandler } = require("../../../helpers/asyncHandler");
const wishlistController = require("../../../controllers/client/Wishlist.Controller.js");


/**
 * @swagger
 * tags:
 *   - name: Wishlist
 *     description: Quản lý danh sách yêu thích của người dùng (yêu cầu token).
 */

/**
 * @swagger
 * /api/v1/wishlist:
 *   get:
 *     summary: Lấy danh sách sản phẩm yêu thích
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: lastId
 *         schema:
 *           type: integer
 *         description: ID sản phẩm cuối cùng đã lấy (cursor-based paging)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Số lượng sản phẩm trả về
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm yêu thích
 *       401:
 *         description: Không xác thực
 */

/**
 * @swagger
 * /api/v1/wishlist:
 *   post:
 *     summary: Thêm sản phẩm vào danh sách yêu thích
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 101
 *     responses:
 *       200:
 *         description: Thêm thành công
 *       401:
 *         description: Không xác thực
 */

/**
 * @swagger
 * /api/v1/wishlist/{productId}:
 *   delete:
 *     summary: Xoá sản phẩm khỏi danh sách yêu thích
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID sản phẩm cần xoá
 *     responses:
 *       200:
 *         description: Xoá thành công
 *       401:
 *         description: Không xác thực
 */

/**
 * @swagger
 * /api/v1/wishlist/remove-many:
 *   post:
 *     summary: Xoá nhiều sản phẩm khỏi danh sách yêu thích
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productItemIds
 *             properties:
 *               productItemIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [101, 102, 103]
 *     responses:
 *       200:
 *         description: Xoá thành công
 *       401:
 *         description: Không xác thực
 */

/**
 * @swagger
 * /api/v1/wishlist/count:
 *   get:
 *     summary: Lấy số lượng sản phẩm trong danh sách yêu thích
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về số lượng
 *       401:
 *         description: Không xác thực
 */

router.get("/", asyncHandler(wishlistController.getProductInWishlist));
router.post("/", asyncHandler(wishlistController.addProductToWishlist));
router.delete("/:productId", asyncHandler(wishlistController.removeProductFromWishlist));
router.post("/remove-many", asyncHandler(wishlistController.removeAllProductFromWishlist));
router.get("/count", asyncHandler(wishlistController.getCountProductInWishlist));

module.exports = router;





router.get("/", asyncHandler(wishlistController.getProductInWishlist));

router.post("/", asyncHandler(wishlistController.addProductToWishlist));

router.delete("/:productId", asyncHandler(wishlistController.removeProductFromWishlist));

router.post("/remove-many", asyncHandler(wishlistController.removeAllProductFromWishlist));

router.get("/count", asyncHandler(wishlistController.getCountProductInWishlist));


module.exports = router;
