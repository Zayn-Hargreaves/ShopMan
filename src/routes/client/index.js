const router = require('express').Router();
const {asyncHandler} = require('../../helpers/asyncHandler');
const {authentication} = require('../../auth/authUtils');
const AuthController = require('../../controllers/admin/authControllers');

router.post("/signup", asyncHandler(AuthController.signup))
router.post("/signup-with-google", asyncHandler(AuthController.signUpWithGoogle))
router.post('/login', asyncHandler(AuthController.login));
router.post('/login-with-google', asyncHandler(AuthController.loginWithGoogle))
router.use(authentication);
router.post('/logout', asyncHandler(AuthController.logout));
router.post('/handleRefreshToken', asyncHandler(AuthController.handleRefreshToken));

module.exports = router;