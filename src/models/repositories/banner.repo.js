
const initializeModels = require("../../db/dbs/associations")
const {Op, where} = require('sequelize')
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
module.exports = BannerRepository