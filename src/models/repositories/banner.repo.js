
const initializeModels = require("../../db/dbs/associations")
const { Op, where } = require('sequelize')
const { getSelectData } = require("../../utils")
const { NotFoundError } = require("../../cores/error.response")
class BannerRepository {
    constructor(models) {
        this.Banner = models.Banner
        this.Shop = models.Shop
        this.Campaign= models.Campaign
        this.Partner = models.Partner
    }
    async getListBanner() {
        return await this.Banner.findAll({
            start_time: {
                [Op.lte]: new Date(),
            },
            end_time: {
                [Op.gte]: new Date
            }
        })
    }
    async getListBannerForAdmin(status, banner_type, shopId, position, from, to, page, limit) {
        let where = {}
        if (status) where.status = status
        if (banner_type) where.banner_type = banner_type
        if (position) where.position = position
        if (from || to) {
            where.createAt = {}
            if (from) where.createAt[Op.gte] = new Date(from)
            if (to) where.createAt[Op.lte] = new Date(to)
        }
        if(shopId) where.ShopId = shopId
        const offset = (page -1) * limit
        const {rows, count} = await this.Banner.findAndCountAll({
            where,
            limit,
            offset,
            attributes:getSelectData(['id','banner_type','title','thumb','link_type','link_target','action','position','start_time','end_time','priority','status']),
            order: [['priority', 'DESC'], ['createdAt', 'DESC']],
        })
        return {
            items:rows,
            total:count,
            page:page,
            limit,
            totalPages: Math.ceil(count/limit)
        }
    }
    
    async addBanner(data){
        if(data.ShopId){
            const shop = await this.Shop.findByPk(data.ShopId)
            if(!shop){
                throw new NotFoundError("Shop not found")
            }
        }
        if(data.CampaignId){
            const campaign = await this.Campaign.findByPk(data.CampaignId)
            if(!campaign){
                throw new NotFoundError("Campaign not found")
            }
        }
        if(data.PartnerId){
            const Partner = await this.Partner.findByPk(data.PartnerId)
            if(!Partner){
                throw new NotFoundError("Partner not found")
            }
        }
        return await this.Banner.create({
            ...data,
        })
    }
    async getDetailBanner(id){
        return this.Banner.findByPk(id)
    }
    async updateBanner(ShopId, BannerId, data){
        return this.Banner.update({data, where:{id:BannerId, ShopId}})
    }
}
module.exports = BannerRepository