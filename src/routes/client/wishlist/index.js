const router = require("express").Router();
const { asyncHandler } = require("../../../helpers/asyncHandler");
const wishlistController = require("../../../controllers/client/Wishlist.Controller.js");

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
 *       name: authorization
 *       required: true
 *       schema:
 *         type: string
 *         example: "Bearer <access_token>"
 *       description: "Access token để xác thực người dùng, định dạng: Bearer <access_token>"
 */

/**
 * @swagger
 * tags:
 *   - name: Wishlist
 *     description: |
 *       Các API trong nhóm này yêu cầu người dùng gửi access token để xác thực.
 *       
 *       👉 Cách gửi access token:
 *       - Trên Swagger UI, nhấn nút "Authorize" góc trên phải.
 *       - Trên app Android hoặc khi gửi request, cần đính kèm access token trong header như sau:
 *         - req.headers['authorization'] = 'Bearer ' + accessToken
 *       - Hoặc nếu test bằng Postman thì vào tab Headers và thêm:
 *         - Key: authorization
 *         - Value: Bearer <access_token>
 */

/**
 * @swagger
 * /api/v1/wishlist:
 *   get:
 *     summary: Get wishlist products
 *     description: Trả về danh sách sản phẩm trong wishlist của người dùng.
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/AccessTokenHeader'
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/wishlist:
 *   post:
 *     summary: Add product to wishlist
 *     description: Thêm sản phẩm vào wishlist của người dùng.
 *     tags: [Wishlist]
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
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 101
 *     responses:
 *       200:
 *         description: Product added
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/wishlist/{productId}:
 *   delete:
 *     summary: Remove product from wishlist
 *     description: Xoá một sản phẩm khỏi wishlist của người dùng.
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/AccessTokenHeader'
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của sản phẩm cần xoá
 *     responses:
 *       200:
 *         description: Product removed
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/wishlist:
 *   delete:
 *     summary: Remove all products from wishlist
 *     description: Xoá toàn bộ sản phẩm trong wishlist của người dùng.
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/AccessTokenHeader'
 *     responses:
 *       200:
 *         description: Wishlist cleared
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/wishlist/count:
 *   get:
 *     summary: Get wishlist count
 *     description: Lấy số lượng sản phẩm trong wishlist của người dùng.
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/AccessTokenHeader'
 *     responses:
 *       200:
 *         description: Count retrieved
 *       401:
 *         description: Unauthorized
 */





router.get("/", asyncHandler(wishlistController.getProductInWishlist));

router.post("/", asyncHandler(wishlistController.addProductToWishlist));

router.delete("/:productId", asyncHandler(wishlistController.removeProductFromWishlist));

router.post("/remove-many", asyncHandler(wishlistController.removeAllProductFromWishlist));

router.get("/count", asyncHandler(wishlistController.getCountProductInWishlist));


module.exports = router;
