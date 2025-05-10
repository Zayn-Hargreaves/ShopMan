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
 *     summary: Get user profile with main address
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/AccessTokenHeader'
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
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
 *                         email:
 *                           type: string
 *                           example: john@example.com
 *                         phone:
 *                           type: string
 *                           example: +123456789
 *                         avatar:
 *                           type: string
 *                           example: https://example.com/avatar.jpg
 *                     addressMain:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         address:
 *                           type: string
 *                           example: 123 Main St
 *                         city:
 *                           type: string
 *                           example: New York
 *                         country:
 *                           type: string
 *                           example: USA
 *                         pincode:
 *                           type: string
 *                           example: 10001
 *                         address_type:
 *                           type: string
 *                           example: main
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User not found
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

module.exports = router;
