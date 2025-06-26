
const { NotFoundError } = require("../../cores/error.response");
const initializeModels = require("../../db/dbs/associations");
const { getSelectData } = require("../../utils");
const { Op, where } = require('sequelize')
class ShopRepository {
    constructor(models) {
        this.Shop = models.Shop
        this.Discounts = models.Discounts
    }
    async findShopBySlug1(slug) {
        if (!slug) throw new NotFoundError("Shop not found")
        return await this.Shop.findOne({
            where: {
                slug: slug,
                status: "active"
            }
        })
    }
    async findShopByPk(ShopId){
        if(!ShopId){
            throw NotFoundError("Shop not found")
        }
        return await this.Shop.findByPk(ShopId)
    }

    async findShopBySlug(slug) {
        if (!slug) throw new NotFoundError("Shop not found");
        console.log("Shop slug ",slug)
        const shop = await this.Shop.findOne({
            where: {
                slug:slug,
                status: 'active'
            },
            include: [
                {
                    model: this.Discounts,
                    as: 'discounts',
                    where: {
                        status: 'active'
                    },
                    required: false
                }
            ]
        });
        if (!shop) throw new NotFoundError("Shop not found");
        return shop;
    }
}

module.exports = ShopRepository