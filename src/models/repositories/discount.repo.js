const initializeModels = require("../../db/dbs/associations")
class DiscountRepository{
    constructor(models){
        this.Discounts = models.Discounts
    }
    static async incrementUserCounts(discountId) {
        await DiscountRepository.increment("UserCounts", {
          where: { id: discountId },
        });
      }
}


module.exports = async () => {
    const models = await initializeModels()
    return await DiscountRepository(models)
}