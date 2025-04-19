const initializeModels = require("../../db/dbs/associations")
const {Op, where} = require("@sequelize/core")
class BannerRepository{
    constructor(models){
        this.Banner = models.Banner
    }
    async getListBanner(){
        return await this.Banner.findAll({
            start_time:{
                [Op.lte]:new Date(),
            },
            end_time:{
                [Op.gte]:new Date
            }
        })
    } 
}
module.exports = async()=>{
    const models= await initializeModels()
    return new BannerRepository(models)
}