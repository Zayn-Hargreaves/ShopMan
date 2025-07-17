const { checkShop, checkPermission, checkShopActive } = require("../../../auth/authUtils");
const orderController = require('../../../controllers/admin/order.controller');
const { asyncHandler } = require('../../../helpers/asyncHandler');
const router = require('express').Router();


router.get(
  '/all',
  checkPermission('order', 'read:all'), checkShopActive,
  asyncHandler(orderController.listOrders)
);

// Lấy danh sách đơn hàng của shop
router.get(
  '/:AdminShopId',
  checkPermission('order', 'read:any'), checkShopActive,
  asyncHandler(orderController.listOrders)
);

// Lấy chi tiết đơn hàng
router.get(
  '/:AdminShopId/detail/:orderDetailId',
  checkPermission('order', 'read:any'),checkShopActive,
  asyncHandler(orderController.getOrder)
);

// Cập nhật trạng thái đơn hàng (ví dụ: cancel, confirm, shipping...)
router.patch(
  '/:AdminShopId/change-status/:orderDetailId',checkShopActive,
  checkPermission('order', 'update:any'),
  asyncHandler(orderController.updateOrderStatus)
);

module.exports = router;
