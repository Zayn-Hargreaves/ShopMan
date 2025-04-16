const initializeModels = require("../../db/dbs/associations")

class DiscountsRepository{
    constructor(models){
        this.Discounts = models.Discounts
    }

    async updateDiscountsStatus(id,status){
        return this.Discounts.update(
            {status:status},
            {where:{id:id}}
        )
    }
}

module.exports = async()=>{
    const models = await initializeModels()
    return new DiscountsRepository(models)
}