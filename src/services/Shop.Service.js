const { NotFoundError } = require("../cores/error.response")
const { getInfoData } = require("../utils")
const ShopRepo = require("../models/repositories/shop.repo.js")
class ShopService{
    static async getShopDetails(slug){
        const shop = await ShopRepo.FindShopAndDiscountBySlug(slug)
        if(!shop){
            throw new NotFoundError("Shop is not found")
        }
        return {
            shop:getInfoData({
                fields:['id','name','shop_desc','slug'],
                object:shop
            }),
            discount:shop.Discounts
        }
    }
}

module.exports = ShopService