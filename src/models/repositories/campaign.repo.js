
const { Op, where } = require('sequelize')
const { getSelectData } = require("../../utils");
const { NotFoundError } = require('../../cores/error.response');
class CampaignRepository {
    constructor(models) {
        this.Campaign = models.Campaign;
        this.Products = models.Products;
        this.Discounts = models.Discounts;
        this.DiscountsProducts = models.DiscountsProducts
    }

    async findCampaignAndDiscountBySlug(slug) {
        if (!slug) {
            throw new Error("Slug is required");
        }
        const campaign = await this.Campaign.findOne({
            where: {
                slug: slug,
                status: "active",
                // start_time: {
                //     [Op.lte]: new Date()
                // },
                // end_time: {
                //     [Op.gte]: new Date()
                // }
            },
            include: [
                {
                    model: this.Discounts,
                    as: 'discount',
                    attributes: getSelectData(['id', 'name', 'code', 'value', 'type', 'StartDate', 'EndDate', 'MinValueOrders']),
                    where: {
                        status: "active",
                        // EndDate: {
                        //     [Op.gte]: new Date()
                        // }
                    }
                }
            ]
        });
        return campaign;
    }
    async findProductsByCampaignSlug(slug, limit = 20, lastId = null) {
    const campaign = await this.Campaign.findOne({
        where: {
            slug,
            status: 'active',
            // start_time: { [Op.lte]: new Date() },
            // end_time: { [Op.gte]: new Date() }
        }
    });

    if (!campaign) {
        return {
            products: [],
            limit,
            total: 0,
            totalPages: 0
        };
    }

    const discounts = await this.Discounts.findAll({
        where: { CampaignId: campaign.id },
        attributes: ['id']
    });

    const DiscountIds = discounts.map(d => d.id);
    if (DiscountIds.length === 0) {
        return {
            products: [],
            limit,
            total: 0,
            totalPages: 0
        };
    }

    // Tìm productId trong DiscountsProducts
    const discountsProducts = await this.DiscountsProducts.findAll({
        where: { DiscountId: { [Op.in]: DiscountIds } },
        attributes: ['ProductId']
    });

    const productIds = discountsProducts.map(dp => dp.ProductId);
    if (productIds.length === 0) {
        return {
            products: [],
            limit,
            total: 0,
            totalPages: 0
        };
    }

    // Sử dụng lastId để lấy dữ liệu tiếp theo
    const whereClause = {
        id: { [Op.in]: productIds },
        status: 'active'
    };
    if (lastId) {
        whereClause.id = { [Op.gt]: lastId }; // Lấy các sản phẩm có ID lớn hơn lastId
    }

    const { count, rows } = await this.Products.findAndCountAll({
        where: whereClause,
        attributes: getSelectData(['id', 'slug', 'name', 'sale_count', 'price', 'discount_percentage', 'thumb', 'rating']),
        limit,
        order: [['id', 'ASC']], // Đảm bảo sắp xếp tăng dần theo ID
    });

    return {
        products: rows,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
    };
}


}

module.exports = CampaignRepository
