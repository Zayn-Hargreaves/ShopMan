const CampaignService = require("../../services/admin/campaign.service.js")
const { OkResponse } = require("../../cores/success.response")

class CampaignController {
    listCampaigns = async (req, res, next) => {
        let filterShopId = req.params.AdminShopId

        new OkResponse({
            message: "List campaigns success",
            metadata: await CampaignService.listCampaigns(
                req.query.status,
                filterShopId,
                req.query.from,
                req.query.to,
                req.query.page,
                req.query.limit,
            )
        }).send(res);
    }
    addCampaign = async (req, res, next) => {
        const isAdmin = req.Role = !!"superadmin"

        new OkResponse({
            message: "Add campaign success",
            metadata: await CampaignService.addCampaign(req.ShopId, req.body, isAdmin)
        }).send(res);
    }
    updateCampaign = async (req, res, next) => {
        const isAdmin = req.Role = !!"superadmin"

        new OkResponse({
            message: "Update campaign success",
            metadata: await CampaignService.updateCampaign(req.ShopId, req.params.campaignId, req.body, isAdmin)
        }).send(res);
    }
    getCampaignDetail = async (req, res, next) => {
        const isAdmin = req.Role = !!"superadmin"

        new OkResponse({
            message: "get campaign detail success",
            metadata: await CampaignService.getDetailCampaign(req.ShopId, req.params.campaignId,isAdmin)
        }).send(res)
    }
    getCampaignProduct = async(req, res,next)=>{
        new OkResponse({
            message:'get product campaign success',
            metadata: await CampaignService.getCampaignProduct(req.params.campaignId, req.query.page, req.query.limit)

        }).send(res)
    }
}

module.exports = new CampaignController();
