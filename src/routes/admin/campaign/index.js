const { checkPermission, checkShopActive } = require('../../../auth/authUtils');
const campaignController = require('../../../controllers/admin/campaign.controller');
const { asyncHandler } = require('../../../helpers/asyncHandler');

const router = require('express').Router();
router.get("/detail/:campaignId", checkPermission("campaign",'read:any'), checkShopActive, asyncHandler(campaignController.getCampaignDetail))
router.get("/product/:campaignId", checkPermission("campaign",'read:any'), checkShopActive, asyncHandler(campaignController.getCampaignProduct))
router.post('/', checkPermission('campaign', 'create::any'),checkShopActive, asyncHandler(campaignController.addCampaign));
router.get('/all', checkPermission('campaign', 'read:all'), checkShopActive,asyncHandler(campaignController.listCampaigns));
router.get('/:AdminShopId', checkPermission('campaign', 'read:any'), checkShopActive,asyncHandler(campaignController.listCampaigns));
router.patch('/update/:campaignId', checkPermission('campaign', 'edit:any'), checkShopActive,asyncHandler(campaignController.updateCampaign));


module.exports = router;
