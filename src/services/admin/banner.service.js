const { Op } = require("sequelize");
const RepositoryFactory = require("../../models/repositories/repositoryFactory");
const { NotFoundError } = require("../../cores/error.response");

/**
 * BannerService – Xử lý nghiệp vụ banner (admin/shop)
 */
class BannerService {
    /**
     * Liệt kê banner với phân trang, lọc, dành cho cả admin và shop
     * @param {Object} params
     * @param {string} [params.status]      - Trạng thái banner (pending, active, ...)
     * @param {string} [params.banner_type] - Loại banner (main, popup,...)
     * @param {number} [params.shopId]      - Shop cần lọc (nếu admin muốn search theo shop)
     * @param {number} [params.position]    - Vị trí hiển thị (slot)
     * @param {string} [params.from]        - Từ ngày (YYYY-MM-DD)
     * @param {string} [params.to]          - Đến ngày (YYYY-MM-DD)
     * @param {number} [params.page=1]      - Trang hiện tại
     * @param {number} [params.limit=20]    - Số bản ghi/trang
     * @param {boolean} isSuperAdmin        - Người dùng có phải superadmin không
     * @returns {Promise<{items: Array, total: number, page: number, limit: number, totalPages: number}>}
     */
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

    /**
     * Thêm banner mới cho shop
     * @param {number} shopId
     * @param {Object} data - Dữ liệu banner mới
     * @returns {Promise<Object>}
     */
    static async addBanner(shopId, data,isAdmin) {
        await RepositoryFactory.initialize();
        const BannerRepo = RepositoryFactory.getRepository("BannerRepository");
        const CampaignRepo = RepositoryFactory.getRepository("CampaingRepository")
        if(!isAdmin && shopId != data.ShopId){
            throw new Error("Missing required fields")
        }
        if(data.CampaignId){
            const campaign = await CampaignRepo.findOneCampaignShop(data.CampaignId,data.ShopId)
            if(!campaign) throw new NotFoundError("Campaign not found")
        }
        if (!data.title || !data.banner_type || !data.position || !data.start_time || !data.end_time)
            throw new Error('Missing required fields');
        return await BannerRepo.addBanner(data)
    }

    /**
     * Cập nhật banner
     * @param {number} shopId
     * @param {number} bannerId
     * @param {Object} data - Thông tin cập nhật
     * @returns {Promise<Object>}
     */
    static async updateBanner(shopId, bannerId, data, isAdmin) {
        await RepositoryFactory.initialize();
        const BannerRepo = RepositoryFactory.getRepository("BannerRepository");
        const CampaignRepo = RepositoryFactory.getRepository("CampaignRepository")
        if(!isAdmin && shopId != data.ShopId){
            throw new Error("Missing required fields")
        }
        if(data.CampaignId){
            const campaign = await CampaignRepo.findOneCampaignShop(data.CampaignId,data.shopId)
            if(!campaign) throw new NotFoundError("Campaign not found")
        }
        if (!data.title || !data.start_time || !data.end_time)
            throw new Error('Missing required fields');
        

        const banner = await BannerRepo.getDetailBanner(bannerId);
        if (!banner) throw new NotFoundError('Banner not found');
        Object.assign(banner, data)
        banner.save()
        return banner;
    }
}

module.exports = BannerService;
