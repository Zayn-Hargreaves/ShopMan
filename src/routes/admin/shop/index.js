const { checkShop, checkPermission } = require("../../../auth/authUtils")
const shopController = require("../../../controllers/admin/shop.controller")
const { asyncHandler } = require("../../../helpers/asyncHandler")

const router = require("express").Router()

router.get("/my", asyncHandler(checkPermission('shop', 'read:any')), asyncHandler(shopController.getMyShop))
router.put("/", asyncHandler(checkPermission('shop', 'update:any')), asyncHandler(shopController.updateShop))
router.get("/:AdminShopId", asyncHandler(checkPermission('shop', 'read:all')), asyncHandler(shopController.getShop))
router.get("/all", asyncHandler(checkPermission('shop','read:all')),asyncHandler(shopController.listShops))
router.patch("/:AdminShopId/status", asyncHandler(checkPermission('shop','update:all')),asyncHandler(shopController.updateShopStatus))

module.exports = router