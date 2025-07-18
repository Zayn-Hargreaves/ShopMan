const { Op } = require("sequelize");
const RepositoryFactory = require("../../models/repositories/repositoryFactory");
const { NotFoundError } = require("../../cores/error.response");


class BannerService {
   
    static async listBanners(ShopId,{
        status,
        banner_type,
        position,
        from,
        to,
        page = 1,
        limit = 20,
    }) {
        await RepositoryFactory.initialize();
        const BannerRepo = RepositoryFactory.getRepository("BannerRepository");
        return await BannerRepo.getListBannerForAdmin(status,banner_type,ShopId,position,from, to, page, limit)
    }

    
    static async addBanner(shopId, data,isAdmin) {
        await RepositoryFactory.initialize();
        const BannerRepo = RepositoryFactory.getRepository("BannerRepository");
        const CampaignRepo = RepositoryFactory.getRepository("CampaingRepository")
        if(!isAdmin && shopId != data.ShopId){
            throw new NotFoundError("Missing required fields")
        }
        if(data.CampaignId){
            const campaign = await CampaignRepo.findOneCampaignShop(data.CampaignId,data.ShopId)
            if(!campaign) throw new NotFoundError("Campaign not found")
        }
        if (!data.title || !data.banner_type || !data.position || !data.start_time || !data.end_time)
            throw new NotFoundError('Missing required fields');
        return await BannerRepo.addBanner(data)
    }

    static async updateBanner(shopId, bannerId, data, isAdmin) {
        await RepositoryFactory.initialize();
        const BannerRepo = RepositoryFactory.getRepository("BannerRepository");
        const CampaignRepo = RepositoryFactory.getRepository("CampaignRepository")
        if(!isAdmin && shopId != data.ShopId){
            throw new NotFoundError("Missing required fields")
        }
        if(data.CampaignId){
            const campaign = await CampaignRepo.findOneCampaignShop(data.CampaignId,data.shopId)
            if(!campaign) throw new NotFoundError("Campaign not found")
        }
        if (!data.title || !data.start_time || !data.end_time)
            throw new NotFoundError('Missing required fields');
        

        const banner = await BannerRepo.getDetailBanner(bannerId);
        if (!banner) throw new NotFoundError('Banner not found');
        Object.assign(banner, data)
        banner.save()
        return banner;
    }
}

module.exports = BannerService;
