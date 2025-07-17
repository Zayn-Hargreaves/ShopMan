const { checkShop, checkPermission, checkShopActive } = require("../../../auth/authUtils");
const inventoryController = require('../../../controllers/admin/inventory.controller');
const { asyncHandler } = require('../../../helpers/asyncHandler');
const router = require('express').Router();

// Lấy danh sách tồn kho

router.get(
  '/all',
  checkPermission('inventory', 'read:all'),checkShopActive,  
  asyncHandler(inventoryController.listInventories)
);

router.get(
  '/:AdminShopId',
  checkPermission('inventory', 'read:any'),checkShopActive,
  asyncHandler(inventoryController.listInventories)
);

// Cập nhật tồn kho (chỉ cho manager/seller hoặc owner)
router.patch(
  '/:AdminShopId/update/:inventoryId',
  checkPermission('inventory', 'update:'),checkShopActive, 
  asyncHandler(inventoryController.updateInventory)
);

module.exports = router;
