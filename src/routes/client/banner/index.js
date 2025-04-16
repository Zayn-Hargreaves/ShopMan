const router = require("express").Router();
const { asyncHandler } = require("../../../helpers/asyncHandler");
const bannerController = require("../../../controllers/Banner.Controller");

router.get("/", asyncHandler(bannerController.getAllBanners));
router.get("/detail/:slug", asyncHandler(bannerController.getBannerBySlug));


module.exports = router;