const CampaignService = require("../services/Campaign.Service.js")
const { OkResponse } = require("../cores/success.response")

class CampaignController {

    getCampaignDetails = async (req, res, next) => {
        const slug = req.params.slug
        new OkResponse({
            message: "get campaign detail success",
            metadata: await CampaignService.getCampainDetails(slug)
        }).send(res)
    }
    getCampaignProduct = async (req, res, next) => {
        const slug = req.params.slug;
        const { page, limit } = req.query;

        const parsedPage = parseInt(page) || 1;
        const parsedLimit = parseInt(limit) || 10;
        const validPage = isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
        const validLimit = isNaN(parsedLimit) || parsedLimit < 1 ? 10 : parsedLimit;

        new OkResponse({
            message: "get product campaign success",
            metadata: await CampaignService.getProductsByCampaignSlug(slug, validPage, validLimit),
        }).send(res);
    };
}

module.exports = new CampaignController()