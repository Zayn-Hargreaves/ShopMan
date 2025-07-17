const { Op } = require("sequelize");
const RepositoryFactory = require("../../models/repositories/repositoryFactory");
const { NotFoundError, ForbiddenError } = require("../../cores/error.response");

class DiscountService {
    // List discounts, hỗ trợ lọc và phân trang
    static async listDiscounts(shopId, query = {}, isSuperAdmin = false) {
        await RepositoryFactory.initialize();
        const DiscountRepo = RepositoryFactory.getRepository("DiscountRepository");
        const {
            status,
            type,
            code,
            from,
            to,
            page = 1,
            limit = 20
        } = query;

        return await DiscountRepo.getAllDiscount(shopId, status, type, code, from, to, page, limit)
    }

    // Add discount cho shop (hoặc campaign)
    static async addDiscount(ShopId, data, isAdmin = false) {
        await RepositoryFactory.initialize();
        const DiscountRepo = RepositoryFactory.getRepository("DiscountRepository");
        const ProductRepo = RepositoryFactory.getRepository("ProductRepository")
        const CampaignRepo = RepositoryFactory.getRepository("CampaignRepository")
        // Validate đơn giản
        if (!data.name || !data.value || !data.type || !data.code)
            throw new Error('Missing required fields');
        // Tạo mới
        if (!ShopId && !data.CampaignId) {
            throw new Error("Missing required fields")
        }
        if(data.CampaignId){
            const campaign = await CampaignRepo.findOneCampaignShop(data.CampaignId,data.ShopId)
            if(!campaign) throw new NotFoundError("Campaign not found")
        }

        const productIds = data.productIds
        if (!isAdmin) {
            if(ShopId != data.ShopId){
                throw new ForbiddenError("Something went wrong, please create discount again")
            }
            for (const id of productIds) {
                const exists = await ProductRepo.findProductInShop(ShopId, id)
                if (!exists) throw new NotFoundError("Product not found")
                }
        }


        return await DiscountRepo.addDiscount(data);
    }

    static async getDiscountDetail(ShopId,id){
        await RepositoryFactory.initialize()
        const DiscountRepo = RepositoryFactory.getRepository("DiscountRepository")
        return await DiscountRepo.getDetailDiscount(ShopId,id)
    }

    // Update discount
    static async updateDiscount(shopId, discountId, data, isAdmin) {
        await RepositoryFactory.initialize();
        const DiscountRepo = RepositoryFactory.getRepository("DiscountRepository");
        const CampaignRepo = RepositoryFactory.getRepository("CampaignRepository")
        if(data.CampaignId){
            const campaign = await CampaignRepo.findOneCampaignShop(data.CampaignId,data.ShopId)
            if(!campaign) throw new NotFoundError("Campaign not found")
        }
        if (!isAdmin) {
            if(shopId != data.ShopId){
                throw new ForbiddenError("Something went wrong, please create discount again")
            }
            for (const id of productIds) {
                const exists = await ProductRepo.findProductInShop(shopId, id)
                if (!exists) throw new NotFoundError("Product not found")
            }
        }
        await DiscountRepo.updateDiscount(discountId,data)
        return await DiscountRepo.getDetailDiscount(data.shopId,discountId)
    }
}

module.exports = DiscountService;
