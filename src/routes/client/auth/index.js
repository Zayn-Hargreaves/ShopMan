const router = require("express").Router();
const { authentication } = require("../../../auth/authUtils");
const authController = require("../../../controllers/Auth.Controllers");
const { asyncHandler } = require("../../../helpers/asyncHandler");
const validate = require("../../../middlewares/validate.middleware");
const authSchemas = require("../../../middlewares/schemas/auth.schema");

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: >
 *       Các API xác thực người dùng (login, signup, quên mật khẩu, liên kết Google, v.v).  
 *       👉 Xem chi tiết tại [Postman Link](https://student-9406.postman.co/workspace/My-Workspace~6a105610-8181-4265-8532-64c17bced017/collection/33038829-164994ee-81be-42a2-a632-a7b81c4516c1?action=share&creator=33038829&active-environment=33038829-33728f14-2c11-4530-bfe3-0159f640f9b5)
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           example: "john.doe@example.com"
 *         phone:
 *           type: string
 *           example: "1234567890"
 *           nullable: true
 *         status:
 *           type: string
 *           example: "active"
 *         avatar:
 *           type: string
 *           example: "https://example.com/avatar.jpg"
 *           nullable: true
 *     Tokens:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         refreshToken:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Error message"
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user with email and password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
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
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     tokens:
 *                       $ref: '#/components/schemas/Tokens'
 *             example:
 *               message: "login success"
 *               metadata:
 *                 user:
 *                   id: 1
 *                   name: "John Doe"
 *                   email: "john.doe@example.com"
 *                   phone: "1234567890"
 *                   status: "active"
 *                   avatar: null
 *                 tokens:
 *                   accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Unauthorized - Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Email or password incorrect"
 *       404:
 *         description: Not Found - Account not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Account not found"
 *       403:
 *         description: Forbidden - Account not active
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Account is not active"
 */
router.post("/login", asyncHandler(validate(authSchemas.login)), asyncHandler(authController.login));

/**
 * @swagger
 * /api/v1/auth/login-with-google:
 *   post:
 *     summary: Login with Google
 *     description: Authenticate a user using Google ID token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *             properties:
 *               idToken:
 *                 type: string
 *                 example: "google-id-token"
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
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     tokens:
 *                       $ref: '#/components/schemas/Tokens'
 *             example:
 *               message: "login with Google success"
 *               metadata:
 *                 user:
 *                   id: 1
 *                   name: "John Doe"
 *                   email: "john.doe@example.com"
 *                   phone: null
 *                   status: "active"
 *                   avatar: null
 *                 tokens:
 *                   accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Unauthorized - Invalid Google token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Login by google error"
 *       403:
 *         description: Forbidden - Account not active
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Account is not active"
 */
router.post("/login-with-google", asyncHandler(validate(authSchemas.loginWithGoogle)), asyncHandler(authController.loginWithGoogle));

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: User signup
 *     description: Register a new user account.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Signup successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     tokens:
 *                       $ref: '#/components/schemas/Tokens'
 *             example:
 *               message: "Signup successful"
 *               metadata:
 *                 user:
 *                   id: 1
 *                   name: "John Doe"
 *                   email: "john.doe@example.com"
 *                   phone: null
 *                   status: "active"
 *                   avatar: null
 *                 tokens:
 *                   accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       409:
 *         description: Conflict - Email already registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Email is already registered"
 */
router.post("/signup", asyncHandler(validate(authSchemas.signup)), asyncHandler(authController.signup));

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: Request an OTP to reset password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
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
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     otp:
 *                       type: string
 *                       example: "123456"
 *             example:
 *               message: "get Otp code successfully"
 *               metadata:
 *                 otp: "123456"
 *       404:
 *         description: Not Found - Email not registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Email is not registered"
 */
router.post("/forgot-password", asyncHandler(validate(authSchemas.forgotPassword)), asyncHandler(authController.forgotPassword));

/**
 * @swagger
 * /api/v1/auth/check-otp:
 *   post:
 *     summary: Check OTP
 *     description: Verify OTP to get reset token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     resetToken:
 *                       type: string
 *                       example: "reset-token"
 *             example:
 *               message: "Otp code is correct"
 *               metadata:
 *                 resetToken: "reset-token"
 *       400:
 *         description: Bad Request - OTP required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "OTP is required"
 *       404:
 *         description: Not Found - OTP not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "OTP not found"
 *       401:
 *         description: Unauthorized - OTP expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "OTP has expired. Please request a new one."
 */
router.post("/check-otp", asyncHandler(validate(authSchemas.checkOtp)), asyncHandler(authController.checkOtp));

/**
 * @swagger
 * /api/v1/auth/change-password:
 *   post:
 *     summary: Change password
 *     description: Change user password using reset token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resetToken
 *               - newPassword
 *               - confirmedPassword
 *             properties:
 *               resetToken:
 *                 type: string
 *                 example: "reset-token"
 *               newPassword:
 *                 type: string
 *                 example: "newpassword123"
 *               confirmedPassword:
 *                 type: string
 *                 example: "newpassword123"
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
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     tokens:
 *                       $ref: '#/components/schemas/Tokens'
 *             example:
 *               message: "Change Password successful"
 *               metadata:
 *                 user:
 *                   id: 1
 *                   name: "John Doe"
 *                   email: "john.doe@example.com"
 *                   phone: null
 *                   status: "active"
 *                   avatar: null
 *                 tokens:
 *                   accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Bad Request - Missing fields or failed to update
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "All fields are required"
 *       409:
 *         description: Conflict - Passwords do not match
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Confirmed password does not match"
 *       404:
 *         description: Not Found - User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "User not found"
 */
router.post("/change-password", asyncHandler(validate(authSchemas.changePassword)), asyncHandler(authController.changePassword));

/**
 * @swagger
 * /api/v1/auth/link-google:
 *   post:
 *     summary: Link Google account
 *     description: Link a Google account to an existing user.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *             properties:
 *               idToken:
 *                 type: string
 *                 example: "google-id-token"
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
 *                 metadata:
 *                   $ref: '#/components/schemas/User'
 *             example:
 *               message: "link to google successfully"
 *               metadata:
 *                 id: 1
 *                 name: "John Doe"
 *                 email: "john.doe@example.com"
 *                 googleId: "google-sub-id"
 *       401:
 *         description: Unauthorized - Invalid Google token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Invalid Google token"
 *       409:
 *         description: Conflict - Account already linked or email mismatch
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Account already linked with Google"
 *       404:
 *         description: Not Found - User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "User not found"
 */
router.post("/link-google", asyncHandler(validate(authSchemas.linkGoogle)), asyncHandler(authController.linkGoogle));

// Middleware authentication được áp dụng cho các endpoint dưới đây
router.use(authentication);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   parameters:
 *     RefreshTokenHeader:
 *       in: header
 *       name: x-rtoken-id
 *       required: true
 *       schema:
 *         type: string
 *       description: Refresh token gửi qua header để xử lý logout hoặc refresh accessToken
 */

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: User logout
 *     description: Logout người dùng bằng cách blacklist refresh token.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/RefreshTokenHeader'
 *     responses:
 *       200:
 *         description: Logout thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 metadata:
 *                   type: boolean
 *             example:
 *               message: "logout success"
 *               metadata: true
 *       500:
 *         description: Internal Server Error - Logout failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Logout failed"
 */

/**
 * @swagger
 * /api/v1/auth/handle-refreshtoken:
 *   post:
 *     summary: Refresh token
 *     description: Cấp lại access token mới khi refresh token còn hạn.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/RefreshTokenHeader'
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
 *                 metadata:
 *                   $ref: '#/components/schemas/Tokens'
 *             example:
 *               message: "refresh token success"
 *               metadata:
 *                 accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Unauthorized - Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Something went wrong, please relogin"
 */

router.post("/logout", asyncHandler(authController.logout));


router.post("/handle-refreshtoken", asyncHandler(authController.handleRefreshToken));

module.exports = router;