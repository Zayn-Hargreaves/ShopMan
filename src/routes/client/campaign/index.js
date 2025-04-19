const router = require("express").Router();
const { asyncHandler } = require("../../../helpers/asyncHandler");
const CampaignController = require("../../../controllers/Campaign.Controller.js");

router.get("/:slug", asyncHandler(CampaignController.getCampaignDetails));

router.get("/:slug/product", asyncHandler(CampaignController.getCampaignProduct))

module.exports = router;
