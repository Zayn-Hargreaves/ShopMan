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


module.exports =  DiscountRepository