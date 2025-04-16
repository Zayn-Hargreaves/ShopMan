const initializeModels = require("../../db/dbs/associations")
const {Op, where} = require("@sequelize/core")
class BannerRepository{
    constructor(models){
        this.Banner = models.Banner
    }
    async getListBanner(time){
        return await this.Banner.findAll({
            start_time:{
                [Op.lte]:time,
            },
            end_time:{
                [Op.gte]:time
            }
        })
    } 
}
module.exports = async()=>{
    const models= await initializeModels()
    return new BannerRepository(models)
}