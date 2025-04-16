const router = require("express").Router();
const { authentication } = require("../../../auth/authUtils");
const authController = require("../../../controllers/Auth.Controllers");
const { asyncHandler } = require("../../../helpers/asyncHandler");
const validate = require("../../../middlewares/validate.middleware");
const authSchemas = require("../../../middlewares/schemas/auth.schema");

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API for user authentication and authorization
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: login success
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         phone:
 *                           type: string
 *                         status:
 *                           type: string
 *                         avatar:
 *                           type: string
 *                     tokens:
 *                       type: object
 *                       properties:
 *                         accessToken:
 *                           type: string
 *                         refreshToken:
 *                           type: string
 *       401:
 *         description: Unauthorized - Invalid email or password
 *       403:
 *         description: Forbidden - Account is not active
 *       404:
 *         description: Not Found - Account not found
 */
router.post("/login", validate(authSchemas.login), asyncHandler(authController.login));

/**
 * @swagger
 * /api/v1/auth/login-with-google:
 *   post:
 *     summary: Login with Google
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idToken:
 *                 type: string
 *                 example: google_id_token
 *             required:
 *               - idToken
 *     responses:
 *       200:
 *         description: Login with Google successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: login with Google success
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         phone:
 *                           type: string
 *                         status:
 *                           type: string
 *                         avatar:
 *                           type: string
 *                     tokens:
 *                       type: object
 *                       properties:
 *                         accessToken:
 *                           type: string
 *                         refreshToken:
 *                           type: string
 *       401:
 *         description: Unauthorized - Invalid Google token
 *       403:
 *         description: Forbidden - Account is not active
 */
router.post("/login-with-google", validate(authSchemas.loginWithGoogle), asyncHandler(authController.loginWithGoogle));

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: User signup
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Signup successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         status:
 *                           type: string
 *                     tokens:
 *                       type: object
 *                       properties:
 *                         accessToken:
 *                           type: string
 *                         refreshToken:
 *                           type: string
 *                    
 *       409:
 *         description: Conflict - Email is already registered
 */
router.post("/signup", validate(authSchemas.signup), asyncHandler(authController.signup));

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Request OTP for password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: get Otp code successfully
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     otp:
 *                       type: string
 *                       example: 123456
 *                 
 *       404:
 *         description: Not Found - Email is not registered
 */
router.post("/forgot-password", validate(authSchemas.forgotPassword), asyncHandler(authController.forgotPassword));

/**
 * @swagger
 * /api/v1/auth/check-otp:
 *   post:
 *     summary: Verify OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 example: 123456
 *             required:
 *               - otp
 *     responses:
 *       200:
 *         description: OTP is correct
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Otp code is correct
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     resetToken:
 *                       type: string
 *       400:
 *         description: Bad Request - OTP is required
 *       401:
 *         description: Unauthorized - OTP has expired
 *       404:
 *         description: Not Found - OTP not found
 */
router.post("/check-otp", validate(authSchemas.checkOtp), asyncHandler(authController.checkOtp));

/**
 * @swagger
 * /api/v1/auth/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resetToken:
 *                 type: string
 *                 example: reset_token
 *               newPassword:
 *                 type: string
 *                 example: newpassword123
 *               confirmedPassword:
 *                 type: string
 *                 example: newpassword123
 *             required:
 *               - resetToken
 *               - newPassword
 *               - confirmedPassword
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Change Password successful
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         phone:
 *                           type: string
 *                         status:
 *                           type: string
 *                         avatar:
 *                           type: string
 *                     tokens:
 *                       type: object
 *                       properties:
 *                         accessToken:
 *                           type: string
 *                         refreshToken:
 *                           type: string
 *       400:
 *         description: Bad Request - All fields are required
 *       409:
 *         description: Conflict - Confirmed password does not match
 *       404:
 *         description: Not Found - User not found
 */
router.post("/change-password", validate(authSchemas.changePassword), asyncHandler(authController.changePassword));

/**
 * @swagger
 * /api/v1/auth/link-google:
 *   post:
 *     summary: Link Google account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idToken:
 *                 type: string
 *                 example: google_id_token
 *             required:
 *               - idToken
 *     responses:
 *       200:
 *         description: Google account linked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Google account linked successfully
 *       401:
 *         description: Unauthorized - Invalid Google token
 *       404:
 *         description: Not Found - User not found
 *       409:
 *         description: Conflict - Account already linked with Google
 */
router.post("/link-google", validate(authSchemas.linkGoogle), asyncHandler(authController.linkGoogle));

// Các endpoint yêu cầu xác thực
router.use(authentication);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: refresh_token
 *             required:
 *               - refreshToken
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: logout success
 *                 metadata:
 *                   type: boolean
 *       500:
 *         description: Internal Server Error - Logout failed
 */
router.post("/logout", validate(authSchemas.logout), asyncHandler(authController.logout));

/**
 * @swagger
 * /api/v1/auth/handle-refreshtoken:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: refresh_token
 *             required:
 *               - refreshToken
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: refresh token success
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       401:
 *         description: Unauthorized - Invalid refresh token
 */
router.post("/handle-refreshtoken", validate(authSchemas.handleRefreshToken), asyncHandler(authController.handleRefreshToken));

module.exports = router;