const { checkPermission, checkShopActive } = require('../../../auth/authUtils');
const bannerController = require('../../../controllers/admin/banner.controller');
const { asyncHandler } = require('../../../helpers/asyncHandler');

const router = require('express').Router();
router.post('/', checkPermission("banner",'create:any'),checkShopActive,asyncHandler(bannerController.addBanner));
router.get('/all', checkPermission("banner",'read:all'),checkShopActive,asyncHandler(bannerController.listBanners));
router.get('/:AdminShopId', checkPermission("banner",'read:any'),checkShopActive,asyncHandler(bannerController.listBanners));
router.patch('/update/:bannerId', checkPermission("banner", 'edit:any'),checkShopActive,asyncHandler(bannerController.updateBanner));

module.exports = router;
