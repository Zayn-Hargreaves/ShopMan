const { checkPermission, checkShopActive } = require('../../../auth/authUtils');
const bannerController = require('../../../controllers/admin/banner.controller');
const discountController = require('../../../controllers/admin/discount.controller');
const { asyncHandler } = require('../../../helpers/asyncHandler');

const router = require('express').Router();


router.post(
  '/:AdminShopId',
  checkPermission('discount', 'create:any'),checkShopActive,
  asyncHandler(discountController.addDiscount)
);
router.get(
  '/all',
  checkPermission('discount', 'read:all'),checkShopActive,
  asyncHandler(discountController.listDiscounts)
);

router.get(
  '/:AdminShopId',
  checkPermission('discount', 'read:any'),checkShopActive,
  asyncHandler(discountController.listDiscounts)
);

router.get(
  '/:AdminShopId/detail/:DiscountId',
  checkPermission('discount', 'read:any'),checkShopActive,
  asyncHandler(discountController.getDiscountDetail));
router.patch(
  '/update/:DiscountId',
  checkPermission('discount', 'edit:any'),checkShopActive,
  asyncHandler(discountController.updateDiscount)
);

module.exports = router;
