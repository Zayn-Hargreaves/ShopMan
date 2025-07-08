const router = require("express").Router();
const { asyncHandler } = require("../../../helpers/asyncHandler");
const userController = require("../../../controllers/User.Controller");

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
 *   - name: User
 *     description: |
 *       Các API trong nhóm này yêu cầu người dùng gửi access token để xác thực.
 *       
 *       👉 Cách gửi access token:
 *       - Swagger UI: nhấn "Authorize" ở góc phải trên.
 *       - Android app hoặc JS: `req.headers['authorization'] = 'Bearer ' + accessToken`
 *       - Postman: tab Header → Key: `authorization`, Value: `Bearer <access_token>`
 */

/**
 * @swagger
 * /api/v1/user/profile:
 *   get:
 *     summary: Lấy thông tin hồ sơ người dùng (kèm địa chỉ chính)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/AccessTokenHeader'
 *     responses:
 *       200:
 *         description: Hồ sơ người dùng được lấy thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OK
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: get user profile successfully
 *                     metadata:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: Nguyễn Văn A
 *                         email:
 *                           type: string
 *                           example: quanva.b21cn618@stu.ptit.edu.vn
 *                         google_id:
 *                           type: string
 *                           nullable: true
 *                         phone:
 *                           type: string
 *                           example: 0987654321
 *                         avatar:
 *                           type: string
 *                           example: https://example.com/avatar.jpg
 *                         balance:
 *                           type: string
 *                           example: "0.00"
 *                         status:
 *                           type: string
 *                           example: active
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                         deletedAt:
 *                           type: string
 *                           format: date-time
 *                           nullable: true
 *                         address:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               UserId:
 *                                 type: integer
 *                               address_type:
 *                                 type: string
 *                                 example: main
 *                               pincode:
 *                                 type: integer
 *                                 example: 700000
 *                               address:
 *                                 type: string
 *                                 example: 123 Nguyễn Trãi
 *                               city:
 *                                 type: string
 *                                 example: Hồ Chí Minh
 *                               country:
 *                                 type: string
 *                                 example: Việt Nam
 *                               createdAt:
 *                                 type: string
 *                                 format: date-time
 *                               updatedAt:
 *                                 type: string
 *                                 format: date-time
 *       401:
 *         description: Không có quyền truy cập - thiếu hoặc sai token
 *       404:
 *         description: Không tìm thấy người dùng
 */


/**
 * @swagger
 * /api/v1/user/profile/update:
 *   put:
 *     summary: Update user profile and main address
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
 *                     example: John Doe
 *                   phone:
 *                     type: string
 *                     example: "+123456789"
 *               Address:
 *                 type: object
 *                 nullable: true
 *                 properties:
 *                   address:
 *                     type: string
 *                     example: 123 Main St
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "update user profile successfully"
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: John Doe
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */

router.get("/profile", asyncHandler(userController.getUserProfile));
router.put("/profile/update", asyncHandler(userController.updateUserProfile));
router.get("/address", asyncHandler(userController.getUserAddress))
router.put("/address", asyncHandler(userController.addUserAddress))

module.exports = router;
