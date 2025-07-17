
const { NotFoundError } = require("../../cores/error.response");
const initializeModels = require("../../db/dbs/associations");
const { getSelectData } = require("../../utils");
const { Op, where } = require('sequelize')
class ShopRepository {
    constructor(models) {
        this.Shop = models.Shop
        this.Discounts = models.Discounts
        this.ShopUserRole = models.ShopUserRole
    }
    async findShopBySlug1(slug) {
        return await this.Shop.findOne({
            where: {
                slug: slug,
                status: "active"
            }
        })
    }
    async findShopByPk(ShopId){
        if(!ShopId){
            throw new NotFoundError("Shop not found")
        }
        return await this.Shop.findByPk(ShopId)
    }

    async findShopBySlug(slug) {
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
    async findShopByUserId(UserId,ShopId){
        return await this.Shop.findOne({where:{UserId,id:ShopId}})
    }
   
    async createNewShop(UserId, data){
        return await this.Shop.create({
            ...data,
            UserId,
            status:'pending'
        })
    }
    async getListShopsByAdmin(status,name, page, limit){
        let where ={}
        if(status) where.status = status
        if(name) where.name = {[Op.iLike] :`%${name}%`}
        const offset = (page - 1) * limit
        const {rows, count} = await this.Shop.findAndCountAll({
            where,
            offset:+offset,
            limit:+limit,
            order: [['createdAt', 'DESC']]
        })
        return {
            items: rows,
            total:count,
            page:+page,
            limit:+limit,
            totalPages:Math.ceil(count/limit)
        }
    }

}

module.exports = ShopRepository