const initializeModels = require("../../db/dbs/associations")
const { getSelectData } = require("../../utils")
class WishlistRepository{
    constructor(models){
        this.WishLists =models.WishLists
        this.Products = models.Products
    }
    async getProductInWishlist(UserId,page, size){
        const offset = (page -1 ) * size
        const {count,rows } = await this.WishLists.findAndCountAll({
            where:{UserId:UserId},
            include:{
                model:this.Products,
                attributes:getSelectData(['id','name','thumb','price','rating', 'desc','ShopId','slug' ])
            },
            offset,
            limit:size
        })
        return {
            totalItems:count,
            product:rows
        }
    }
    async checkProductInWishlist({ ProductId, UserId }) {
        return await this.WishLists.findOne({
            where: {
                ProductId,
                UserId
            }
        })
    }
    async removeProductFromWishlist(UserId, ProductId){
        if(!UserId||!ProductId){
            throw new Error("Missing UserId or ProductId")
        }
        return await this.WishLists.destroy({
            where:{
                UserId,
                ProductId
            }
        })
    }
    async removeAllProductFromWishlist(UserId){
        if(!UserId){
            throw new Error("Missing UserId")
        }
        return await this.WishLists.destroy({
            where:{UserId}
        })
    }
    async countProductInWishlist(UserId){
        if(!UserId){
            throw new Error("Missing UserId")
        }
        return await this.WishLists.count({
            where:{UserId}
        })
    }
}

module.exports = async()=>{
    const models = await initializeModels()
    return new WishlistRepository(models)
}