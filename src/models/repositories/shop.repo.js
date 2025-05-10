
const { NotFoundError } = require("../../cores/error.response");
const initializeModels = require("../../db/dbs/associations");
const { getSelectData } = require("../../utils");
const { Op } = require('sequelize')
class ShopRepository {
    constructor(models) {
        this.Shop = models.Shop
        this.Discounts = models.Discounts
    }
    async findShopBySlug(slug) {
        if (!slug) throw new NotFoundError("Shop not found");

        let decodedSlug;
        try {
            decodedSlug = decodeURIComponent(slug);
        } catch (err) {
            throw new NotFoundError("Invalid shop slug::",err);
        }

        const shop = await this.Shop.findOne({
            where: {
                slug: decodedSlug,
                status: 'active',
            },
            include: [
                {
                    model: this.Discounts,
                    as: 'discounts',
                    attributes: getSelectData([
                        'id', 'name', 'code', 'value', 'type', 'StartDate', 'EndDate', 'MinValueOrders'
                    ]),
                    where: {
                        status: "active",
                        EndDate: {
                            [Op.gte]: new Date()
                        }
                    },
                    required: false // để shop vẫn trả ra dù chưa có discount nào
                }
            ]
        });

        if (!shop) throw new NotFoundError("Shop not found");
        return shop;
    }
}

module.exports = ShopRepository