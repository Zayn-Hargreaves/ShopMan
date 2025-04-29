const CampaignService = require("../services/Campaign.Service.js")
const { OkResponse } = require("../cores/success.response")

class CampaignController {
   
    getCampaignDetails = async(req, res, next)=>{
        const slug = req.params.slug
        new OkResponse({
            message:"get campaign detail success",
            metadata: await CampaignService.getCampainDetails(slug)
        }).send(res)
    }
    getCampaignProduct = async(req, res, next)=>{
        const slug = req.params.slug
        const {page,limit} = req.query
        new OkResponse({
            message:'get product campaign success',
            metadata: await CampaignService.getProductsByCampaignSlug(slug,page,limit)
        }).send(res)
    }
}

module.exports = new CampaignController()