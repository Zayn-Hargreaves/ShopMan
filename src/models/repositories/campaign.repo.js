const { Op, where } = require("@sequelize/core")
const initializeModels = require("../../db/dbs/associations");
const {getSelectData } = require("../../utils");
class CampaignRepository {
    constructor(models) {
        this.Campaign = models.Campaign;
        this.Products = models.Products;
        this.Discounts = models.Products;
    }

    async findCampaignAndDiscountBySlug(slug) {
        if(!slug) {
            throw new Error("Slug is required");
        }
        const campaign = await this.Campaign.findOne({
            where: {
                slug: slug,
                status: "active",
                start_time: {
                    [Op.lte]: new Date()
                },
                end_time: {
                    [Op.gte]: new Date()
                }
            },
            include:[
                {
                    model: this.Discounts,
                    attributes: getSelectData(['id', 'name','code', 'value','type', 'StartDate','EndDate','MinValueOrders']),
                    where:{
                        status: "active",
                        EndDate: {
                            [Op.gte]: new Date()
                        }
                    }
                }
            ]
        });
        return campaign;
    }
    async findProductsByCampaignSlug(slug, page = 1, limit = 20){
        const campaign = await this.Campaign.findOne({where:{slug}})
        if(!campaign){
            throw new NotFoundError("Campaign not found or ended")
        }
        const offset = (page -1 ) * limit
        const discounts = await this.Discounts.findAll({
            where:{CampaignId:campaign.id},
            attributes:getSelectData(['id'])
        })
        const DiscountIds = discounts.map(d=>d.id)
        const {count, rows} = await this.Products.findAndCountAll({
            include:[
                {
                    model:this.Discounts,
                    through:{model:this.DiscountsProducts},
                    where:{id:{[Op.in]:DiscountIds}},
                    require:true,
                    attributes:getSelectData('id', 'name','code','value')
                }
            ],
            where:{status:'active'},
            limit,
            offset,
            order:[['sort','ASC']]
        })
        return{
            products:rows,
            pagination:{
                page,
                limit,
                total:count,
                totalPages:Math.ceil(count/limit)
            }
        }
    }
}

module.exports = async () => {
    const models = await initializeModels();
    return new CampaignRepository(models);
}