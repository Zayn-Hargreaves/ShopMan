const { NotFoundError } = require("../../cores/error.response.js");
const { getInfoData } = require("../../utils/index.js");
const RepositoryFactory = require("../../models/repositories/repositoryFactory.js");
const RedisService = require("./Redis.Service.js");
class CampaignService {
    static async getCampainDetails(slug){
        await RepositoryFactory.initialize()
        const CampaignRepo = RepositoryFactory.getRepository("CampaignRepository")
        const cacheKey = `campaign:slug:${slug}`
        let campaign
        // campaign = await RedisService.getCachedData(cacheKey)
        if(!campaign){
            campaign = await CampaignRepo.findCampaignAndDiscountBySlug(slug)
            if(!campaign){
                await RedisService.cacheData(cacheKey,{},300)
                console.log(await RedisService.getCachedData(cacheKey))
                throw new NotFoundError("Campaign is not found or ended")
            }
            await RedisService.cacheData(cacheKey,campaign,3600)
        }
        return {
            campaign:getInfoData({
                fields:['id', 'title', 'slug', 'description','thumb','start_time','end_time'],
                object:campaign
            }),
            discount:campaign.discount,
        }
    } 
    static async getProductsByCampaignSlug(slug, limit = 10, lastId){
        await RepositoryFactory.initialize()
        const cacheKey = `campaign:slug:${slug}:product:limit:${limit}:lastId${lastId}`
        const CampaignRepo = RepositoryFactory.getRepository("CampaignRepository")
        let result 
        result = await RedisService.getCachedData(cacheKey)
        if(!result){
            result = await CampaignRepo.findProductsByCampaignSlug(slug, limit, lastId)
            if(!result){
                await RedisService.cacheData(cacheKey, {}, 600)
                throw new NotFoundError("Campaign not found or ended");
            }
            await RedisService.cacheData(cacheKey, result, 3600)
        }

        return result
    }

}

module.exports = CampaignService;