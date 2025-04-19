const router = require("express").Router();
const { asyncHandler } = require("../../../helpers/asyncHandler");
const bannerController = require("../../../controllers/Banner.Controller.js");

router.get("/", asyncHandler(bannerController.getAllBanner));


module.exports = router;