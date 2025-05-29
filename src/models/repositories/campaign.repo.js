
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
    async findProductsByCampaignSlug(slug, page = 1, limit = 20) {
        console.log(page, limit)
        const campaign = await this.Campaign.findOne({
            where: {
                slug,
                status: 'active',
                // start_time: { [Op.lte]: new Date() },
                // end_time: { [Op.gte]: new Date() }
            }
        });

        if (!campaign) {
            return campaign
        }

        const discounts = await this.Discounts.findAll({
            where: { CampaignId: campaign.id },
            attributes: ['id']
        });

        const DiscountIds = discounts.map(d => d.id);
        console.log(DiscountIds)
        if (DiscountIds.length === 0) {
            return {
                products: [],
                limit,
                total: 0,
                totalPages: 0
            };
        }

        // 🧠 Tìm productId trong DiscountsProducts
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
        
        const offset = (page - 1) * limit;
        const { count, rows } = await this.Products.findAndCountAll({
            where: {
                id: { [Op.in]: productIds },
                status: 'active'
            },
            attributes: getSelectData(['id', 'slug', 'name', 'sale_count', 'price', 'discount_percentage', 'thumb', 'rating']),
            limit,
            offset,
            order: [['sort', 'ASC']],
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
