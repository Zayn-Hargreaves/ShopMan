const { checkShop } = require("../../auth/authUtils");
const shopController = require("../../controllers/admin/shop.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");

const router = require("express").Router()


router.post("/register",asyncHandler(shopController.registerShop))

router.use('/:ShopId/shop',checkShop, require('./shop'));
router.use('/:ShopId/member',checkShop, require('./member'));
router.use('/:ShopId/product', checkShop,require('./product'));
router.use('/:ShopId/order', checkShop,require('./order'));
router.use('/:ShopId/inventory', checkShop,require('./inventory'));
router.use('/:ShopId/campaign', checkShop,require('./campaign'));
router.use('/:ShopId/discount', checkShop,require('./discount'));
router.use('/:ShopId/banner',checkShop, require('./banner'));
router.use('/:ShopId/analytics', checkShop,require('./analytics'));
router.use('/:ShopId/notification', checkShop,require('./notification'));
// router.use('/report', require('./report'));
// router.use('/complaint', require('./complaint'));
// router.use('/settings', require('./settings'));

module.exports = router;