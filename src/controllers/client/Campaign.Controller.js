const CampaignService = require("../../services/client/Campaign.Service.js")
const { OkResponse } = require("../../cores/success.response.js")

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
        const { limit, lastId } = req.query;

        const parsedLastId = parseInt(lastId) || 1;
        const parsedLimit = parseInt(limit) || 10;
        const validParsedLastId = isNaN(parsedLastId) || parsedLastId < 1 ? 1 : parsedLastId;
        const validLimit = isNaN(parsedLimit) || parsedLimit < 1 ? 10 : parsedLimit;

        new OkResponse({
            message: "get product campaign success",
            metadata: await CampaignService.getProductsByCampaignSlug(slug,validLimit, validParsedLastId),
        }).send(res);
    };
}

module.exports = new CampaignController()