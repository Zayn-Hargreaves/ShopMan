const { Op } = require("sequelize");
const RepositoryFactory = require("../../models/repositories/repositoryFactory");
const { ConflictError, NotFoundError } = require("../../cores/error.response");

/**
 * Service cho Campaign (Chiến dịch quảng cáo)
 */
class CampaignService {
    /**
     * Lấy danh sách campaign của 1 shop, hỗ trợ phân trang, lọc
     * @param {number} shopId - ID của shop
     * @param {Object} query
     * @param {string} [query.status]        - Trạng thái ('active', 'inactive', ...)
     * @param {string} [query.from]          - Từ ngày (YYYY-MM-DD)
     * @param {string} [query.to]            - Đến ngày (YYYY-MM-DD)
     * @param {number} [query.page=1]        - Trang hiện tại
     * @param {number} [query.limit=20]      - Số bản ghi/trang
     * @returns {Promise<{items: Array, total: number, page: number, limit: number, totalPages: number}>}
     */
    static async listCampaigns(status,shopId,from, to, page, limit ) {
        console.log(status,shopId,from, to, page, limit)
        await RepositoryFactory.initialize();
        const CampaignRepo = RepositoryFactory.getRepository("CampaignRepository");

        return await CampaignRepo.getListCampaign(status, shopId, from,to, page,limit)
    }

    /**
     * Thêm campaign mới cho shop
     * @param {number} shopId
     * @param {Object} data - { title, description, thumb, start_time, end_time, status }
     * @returns {Promise<Object>}
     */
    static async addCampaign(shopId, data, isAdmin) {
        await RepositoryFactory.initialize();

        const CampaignRepo = RepositoryFactory.getRepository("CampaignRepository");
        const DiscountRepo = RepositoryFactory.getRepository("DiscountRepository")
        const BannerRepo = RepositoryFactory.getRepository("BannerRepository")

        if(!isAdmin ){
            if( ! data.ShopIds.includes(shopId)){
                throw new ConflictError("you don't have permission to create Campaign")
            }
            const checkDiscount = DiscountRepo.checkDiscount(data.discountIds,shopId)
            if(!checkDiscount){
                throw new ConflictError("you dont have some discount, please retry")
            }
        }
        const checkbanner = await BannerRepo.getDetailBanner(data.bannerId)
        if(!checkbanner) throw NotFoundError("Banner not found")
        if (!data.title || !data.start_time || !data.end_time || !data.status)
            throw new NotFoundError('Missing required fields');
        if (new Date(data.end_time) < new Date(data.start_time)) throw new ConflictError('End time must after start time');
        
        return await CampaignRepo.addCampaign(data);
    }


    static async getDetailCampaign(ShopId, CampaignId, isAdmin){
        await RepositoryFactory.initialize()
        const CampaignRepo = RepositoryFactory.getRepository("CampaignRepository")
        return await CampaignRepo.getCampaignDetail(ShopId, CampaignId, isAdmin)
    }

    /**
     * Cập nhật campaign
     * @param {number} shopId
     * @param {number} campaignId
     * @param {Object} data
     * @returns {Promise<Object>}
     */

    static async getCampaignProduct(campaignId, page = 1, limit= 20){
        await RepositoryFactory.initialize()
        const DiscountRepo = RepositoryFactory.getRepository("DiscountRepository")
        return await DiscountRepo.getProductCampaign(campaignId, page, limit)   
    }
    static async updateCampaign(shopId, campaignId, data, isAdmin) {
        await RepositoryFactory.initialize();
        const CampaignRepo = RepositoryFactory.getRepository("CampaignRepository");
        const BannerRepo = RepositoryFactory.getRepository("BannerRepository")
        if(!isAdmin){
            // Kiểm tra campaignId này có thuộc shop không
            const mapping = await CampaignRepo.findOneCampaignShop(campaignId, shopId)
            if (!mapping) throw new NotFoundError("No permission to update this campaign");
        }
        const checkbanner = await BannerRepo.getDetailBanner(data.bannerId)
        if(!checkbanner) throw new NotFoundError("Banner not found")
        if (!data.title || !data.start_time || !data.end_time || !data.status)
            throw new NotFoundError('Missing required fields');
       
        return await CampaignRepo.updateCampaign(campaignId, data)

        
    }
}

module.exports = CampaignService;
