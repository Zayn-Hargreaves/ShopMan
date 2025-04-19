const { NotFoundError } = require("../cores/error.response.js");
const CampaignRepo = require("../models/repositories/campaign.repo.js");
const productRepo = require("../models/repositories/product.repo.js");
const { getInfoData } = require("../utils/index.js");
class CampaignService {
    static async getCampainDetails(slug){
        const campaign = await CampaignRepo.findCampaignAndDiscountBySlug(slug)
        if(!campaign){
            throw new NotFoundError("Campaign is not found or ended")
        }
        return {
            campaign:getInfoData({
                fields:['id', 'title', 'slug', 'description','start_time','end_time'],
                object:campaign
            }),
            discount:campaign.Discounts,
        }
    } 
    static async getProductsByCampaignSlug(slug, page = 1, limit = 20){
        const {products, pagination} = await CampaignRepo.findProductsByCampaignSlug(slug, page, limit)
        return {products, pagination}
    }

}

module.exports = CampaignService;