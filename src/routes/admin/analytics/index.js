const { checkShopActive } = require('../../../auth/authUtils');
const analyticsController = require('../../../controllers/admin/analytics.controller');
const { asyncHandler } = require('../../../helpers/asyncHandler');

const router = require('express').Router();

router.get('/revenue/:AdminShopId?', checkShopActive,asyncHandler(analyticsController.getRevenue));
router.get('/order-status/:AdminShopId?', checkShopActive,asyncHandler(analyticsController.getOrderStatus));
router.get('/top-products/:AdminShopId?', checkShopActive,asyncHandler(analyticsController.getTopProducts));

module.exports = router;






// module.exports = router

