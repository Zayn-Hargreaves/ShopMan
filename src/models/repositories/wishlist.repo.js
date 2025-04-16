const initializeModels = require("../../db/dbs/associations")
const { getSelectData } = require("../../utils")
const {WishLists,Products} = await initializeModels
class WishlistRepository{
    constructor(models){
        this.WishLists =models.WishLists
        this.Products = models.Products
    }
    async getProductWishlist(UserId){
        return await this.WishLists.findAll({
            where:{UserId:UserId},
            include:{
                model:this.Products,
                attributes:getSelectData(['id','name','thumb','price','rating', 'desc','ShopId','slug' ])
            }
        })
    }
}

module.exports = async()=>{
    const models = await initializeModels()
    return new WishlistRepository(models)
}