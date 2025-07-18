const router = require("express").Router();
const { asyncHandler } = require("../../../helpers/asyncHandler");
const CartController = require("../../../controllers/client/Cart.Controller.js");

/**
 * @swagger
 * tags:
 *   - name: Cart
 *     description: Quản lý giỏ hàng (yêu cầu token).
 */

/**
 * @swagger
 * /api/v1/cart:
 *   get:
 *     summary: Lấy tất cả sản phẩm trong giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm trong giỏ hàng
 *       401:
 *         description: Không xác thực
 */

/**
 * @swagger
 * /api/v1/cart/add:
 *   post:
 *     summary: Thêm sản phẩm vào giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ProductId
 *               - skuNo
 *               - quantity
 *             properties:
 *               ProductId:
 *                 type: integer
 *               skuNo:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Thêm sản phẩm vào giỏ hàng thành công
 *       401:
 *         description: Không xác thực
 */

/**
 * @swagger
 * /api/v1/cart/update:
 *   put:
 *     summary: Cập nhật số lượng sản phẩm trong giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - CartDetailId
 *               - skuNo
 *               - quantity
 *             properties:
 *               CartDetailId:
 *                 type: integer
 *               skuNo:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cập nhật sản phẩm thành công
 *       401:
 *         description: Không xác thực
 */

/**
 * @swagger
 * /api/v1/cart/remove/{productId}:
 *   delete:
 *     summary: Xoá một sản phẩm khỏi giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
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
 *         description: Xoá thành công
 *       401:
 *         description: Không xác thực
 */

/**
 * @swagger
 * /api/v1/cart/remove/product/many:
 *   post:
 *     summary: Xoá nhiều sản phẩm khỏi giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - CartDetailIds
 *             properties:
 *               CartDetailIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Xoá thành công
 *       401:
 *         description: Không xác thực
 */

/**
 * @swagger
 * /api/v1/cart/size:
 *   get:
 *     summary: Lấy số lượng sản phẩm trong giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về số lượng sản phẩm
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
 *       401:
 *         description: Không xác thực
 */

router.get("/", asyncHandler(CartController.getCart));
router.post("/add", asyncHandler(CartController.addProductToCart));
router.put("/update", asyncHandler(CartController.updateProductToCart));
router.delete("/remove/:productId", asyncHandler(CartController.removeProductFromCart));
router.post("/remove/product/many", asyncHandler(CartController.removeAllProductFromCart));
router.get("/size", asyncHandler(CartController.getNumberOfProductInCart));

module.exports = router;
