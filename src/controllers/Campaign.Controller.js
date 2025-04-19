const CampaignService = require("../services/Campaign.Service.js")
const { OkResponse } = require("../cores/success.response")

class CampaignController {
    getAllCampains= async(req,res, next)=>{
        new OkResponse({
            message:"get all campaigns success",
            metadata: await CampaignService.getAllCampaigns()
        }).send(res)
    }
    getCampaignDetails = async(req, res, next)=>{
        const slug = req.params.slug
        new OkResponse({
            message:"get campaign detail success",
            metadata: await CampaignService.getCampainDetails(slug)
        }).send(res)
    }
    getCampaignProduct = async(req, res, next)=>{
        const slug = req.params
        const {page = 1, limit = 20} = req.query
        new OkResponse({
            message:'get product campaign success',
            metadata: await CampaignService.getProductsByCampaignSlug(slug,parseInt(page),parseInt(limit))
        }).send(res)
    }
}

module.exports = new CampaignController()