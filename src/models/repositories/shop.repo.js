const { NotFoundError } = require("../../cores/error.response");
const initializeModels = require("../../db/dbs/associations");
const { getSelectData } = require("../../utils");
const {Op} = require("@sequelize/core")
class ShopRepository{
    constructor(models){
        this.Shop = models.Shop
        this.Discounts = models.Discounts
    }
    static async findShopBySlug(slug){
        if(!slug){
            throw new NotFoundError("Shop not found")
        }
        const shop = await this.Shop.findOne({
            where:{
                slug:slug,
                status:'active',
            },
            include:[
                {
                    models:this.Discounts,
                    attribute:getSelectData(['id','name','code', 'value','type','StartDate','EndDate','MinValueOrders']),
                    where:{
                        status:"active",
                        EndDate:{
                            [Op.gte]:new Date()
                        }
                    }
                }
            ]
        })
        return shop
    }
}

module.exports=ShopRepository