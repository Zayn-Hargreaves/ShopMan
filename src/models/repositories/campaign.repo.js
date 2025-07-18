
const { Op, where } = require('sequelize')
const { getSelectData, getUnselectData } = require("../../utils");
const { NotFoundError, ConflictError } = require('../../cores/error.response');
class CampaignRepository {
    constructor(models) {
        this.Campaign = models.Campaign;
        this.Products = models.Products;
        this.Discounts = models.Discounts;
        this.DiscountsProducts = models.DiscountsProducts
        this.CampaignShop = models.CampaignShop
        this.Shop = models.Shop
    }

    async findCampaignAndDiscountBySlug(slug) {
        if (!slug) {
            throw new NotFoundError("Slug is required");
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

    async getListCampaign(status, ShopId, from, to, page = 1, limit = 20) {
        console.log(page, limit)
        let where = {};
        if (status) where.status = status;
        if (from || to) {
            where.start_time = {};
            if (from) where.start_time[Op.gte] = new Date(from);
            if (to) where.start_time[Op.lte] = new Date(to);
        }
        const offset = (page - 1) * limit;

        // Nếu không phải super admin, phải include CampaignShop để lọc theo ShopId
        let include = [];
        if (ShopId) {
            // Nếu là superadmin thì có thể lấy hết, hoặc thêm filter nếu truyền ShopId
            if (ShopId) {
                include.push({
                    model: this.CampaignShop,
                    where: { ShopId: ShopId },
                    required: true,
                });
            }
            // Nếu không truyền ShopId thì không cần include
        }

        const { rows, count } = await this.Campaign.findAndCountAll({
            where,
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            include,
        });

        return {
            items: rows,
            page: page,
            limit: limit,
            totalPages: Math.ceil(count / limit),
            total: count
        };
    }
    async addCampaign(data) {
        const campaign = await this.Campaign.create({
            ...data,
            status: 'inactive'
        })

        if (Array.isArray(data.ShopIds) && data.ShopIds.length > 0) {
            const mapping = data.ShopIds.map(shopId => ({
                CampaignId: campaign.id,
                ShopId: shopId
            }));
            await this.CampaignShop.bulkCreate(mapping);
        }
        await this.Discounts.update(
            { CampaignId: campaign.id },
            { where: { id: data.discountIds } }
        )
        return campaign
    }
    async findOneCampaignShop(CampaignId, ShopId) {
        let where = { CampaignId }
        if (ShopId) {
            where.ShopId = ShopId
        }
        return await this.CampaignShop.findOne({ where })
    }
    async getCampaignDetail(ShopId, CampaignId, isAdmin) {
        let where = { id: CampaignId }
        if (!isAdmin) {
            if (!ShopId) {
                throw new ConflictError("You dont have permission to access this resource")
            }
            where.ShopId = ShopId
        }
        return await this.Campaign.findOne({
            where,
            include: [
                {
                    model: this.Shop,
                    as: "shops",
                    require: false,
                    attributes: getSelectData(['name', 'status', 'thumb', 'desc', 'shopLocation', 'rating'])
                }, {
                    model: this.Discounts,
                    as: "discount",
                    require: false,
                    attributes: getUnselectData(['ShopId', "CampaignId", 'createdAt', 'updatedAt'])
                }
            ]
        })
    }
    // Cập nhật campaign info
    async updateCampaign(id, data) {
        // Update info
        await this.Campaign.update(data, { where: { id } });

        // Update list discount
        if (Array.isArray(data.discountIds)) {
            // Lấy tất cả discount hiện tại của campaign
            const oldDiscounts = await this.Discounts.findAll({
                where: { CampaignId: id },
                attributes: ['id']
            });
            const oldDiscountIds = oldDiscounts.map(d => d.id);

            // Discount bị bỏ (cũ nhưng không còn trong mảng mới)
            const toRemove = oldDiscountIds.filter(oldId => !data.discountIds.includes(oldId));
            // Discount mới (có trong mảng mới, nhưng chưa gán campaign)
            const toAdd = data.discountIds.filter(newId => !oldDiscountIds.includes(newId));

            // Bỏ liên kết với campaign (unset CampaignId)
            if (toRemove.length > 0) {
                await this.Discounts.update(
                    { CampaignId: null },
                    { where: { id: toRemove } }
                );
            }

            // Gán CampaignId cho discount mới
            if (toAdd.length > 0) {
                await this.Discounts.update(
                    { CampaignId: id },
                    { where: { id: toAdd } }
                );
            }
        }

        // Có thể trả về campaign mới nếu cần
        return await this.Campaign.findByPk(id);
    }

}

module.exports = CampaignRepository
