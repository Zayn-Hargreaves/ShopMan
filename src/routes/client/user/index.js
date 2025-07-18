const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../../../helpers/asyncHandler");
const userController = require("../../../controllers/client/User.Controller");

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: API quản lý thông tin người dùng, yêu cầu xác thực bằng JWT.
 */

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
 *       description: Token JWT dạng Bearer để xác thực
 *   schemas:
 *     Address:
 *       type: object
 *       properties:
 *         address_type:
 *           type: string
 *           example: main
 *         pincode:
 *           type: integer
 *           example: 700000
 *         address:
 *           type: string
 *           example: "123 Nguyễn Trãi"
 *         city:
 *           type: string
 *           example: "Hồ Chí Minh"
 *         country:
 *           type: string
 *           example: "Việt Nam"
 */

/**
 * @swagger
 * /api/v1/user/profile:
 *   get:
 *     summary: Lấy thông tin hồ sơ người dùng
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/AccessTokenHeader'
 *     responses:
 *       200:
 *         description: Lấy thành công thông tin người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: get user profile successfully
 *                 metadata:
 *                   type: object
 *       401:
 *         description: Không xác thực
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.get("/profile", asyncHandler(userController.getUserProfile));

/**
 * @swagger
 * /api/v1/user/profile/update:
 *   put:
 *     summary: Cập nhật hồ sơ người dùng và địa chỉ chính
 *     tags: [User]
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
 *               User:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: Nguyễn Văn A
 *                   phone:
 *                     type: string
 *                     example: 0909090909
 *               Address:
 *                 $ref: '#/components/schemas/Address'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: update user profile successfully
 *                 metadata:
 *                   type: object
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy người dùng
 *       401:
 *         description: Không xác thực
 */
router.put("/profile/update", asyncHandler(userController.updateUserProfile));

/**
 * @swagger
 * /api/v1/user/address:
 *   get:
 *     summary: Lấy danh sách địa chỉ người dùng
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/AccessTokenHeader'
 *     responses:
 *       200:
 *         description: Lấy thành công danh sách địa chỉ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: get user address success
 *                 metadata:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Address'
 *       401:
 *         description: Không xác thực
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.get("/address", asyncHandler(userController.getUserAddress));

/**
 * @swagger
 * /api/v1/user/address:
 *   put:
 *     summary: Thêm địa chỉ mới cho người dùng
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/AccessTokenHeader'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       200:
 *         description: Thêm địa chỉ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: add user address success
 *                 metadata:
 *                   $ref: '#/components/schemas/Address'
 *       401:
 *         description: Không xác thực
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.put("/address", asyncHandler(userController.addUserAddress));

module.exports = router;
