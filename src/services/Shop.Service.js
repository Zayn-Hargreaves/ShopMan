const { NotFoundError } = require("../cores/error.response")
const { getInfoData } = require("../utils")
const ShopRepo = require("../models/repositories/shop.repo.js")
const repositoryFactory = require("../models/repositories/repositoryFactory.js")
class ShopService{
    static async getShopDetails(slug){
        await repositoryFactory.initialize()
        const ShopRepo = repositoryFactory.getRepository("ShopRepository")
        console.log(ShopRepo)
        const shop = await ShopRepo.findShopBySlug(slug)
        if(!shop){
            throw new NotFoundError("Shop is not found")
        }
        return {
            shop:getInfoData({
                fields:['id','name','desc','slug','logo','shopLocation','rating','slug'],
                object:shop
            }),
            discount:shop.Discounts
        }
    }
}

module.exports = ShopService