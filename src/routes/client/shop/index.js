const router = require("express").Router()
const SearchController = require("../../../controllers/Search.Controller")
const ShopController = require("../../../controllers/Shop.Controller.js")
const {asyncHandler} = require("../../../helpers/asyncHandler.js")

router.get("/:slug",asyncHandler(ShopController.getShopDetail))
router.get("/:slug/product", asyncHandler(SearchController.getProductByShop))

module.router = router