const router = require("express").Router();
const { asyncHandler } = require("../../../helpers/asyncHandler");
const userController = require("../../../controllers/User.Controller");

/**
 * @swagger
 * /api/v1/user/profile:
 *   get:
 *     summary: Get user profile with main address
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
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
 *                           example: john.doe@example.com
 *                         status:
 *                           type: string
 *                           example: active
 *                         phone:
 *                           type: string
 *                           nullable: true
 *                           example: +1234567890
 *                         avatar:
 *                           type: string
 *                           nullable: true
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
 *                           example: Main
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.get("/profile", asyncHandler(userController.getUserProfile));

/**
 * @swagger
 * /api/v1/user/profile/update:
 *   put:
 *     summary: Update user profile and main address
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
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
 *                     nullable: true
 *                     example: +1234567890
 *                   avatar:
 *                     type: string
 *                     nullable: true
 *                     example: https://example.com/avatar.jpg
 *               Address:
 *                 type: object
 *                 nullable: true
 *                 properties:
 *                   address:
 *                     type: string
 *                     example: 123 Main St
 *                   city:
 *                     type: string
 *                     example: New York
 *                   country:
 *                     type: string
 *                     example: USA
 *                   pincode:
 *                     type: string
 *                     example: 10001
 *                   address_type:
 *                     type: string
 *                     example: Main
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
 *                   example: update user profile successfully
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
 *                           example: john.doe@example.com
 *                         status:
 *                           type: string
 *                           example: active
 *                         phone:
 *                           type: string
 *                           nullable: true
 *                           example: +1234567890
 *                         avatar:
 *                           type: string
 *                           nullable: true
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
 *                           example: Main
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.put("/profile/update", asyncHandler(userController.updateUserProfile));

module.exports = router;