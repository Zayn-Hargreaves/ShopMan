const discountRepo = require("../models/repositories/discount.repo.js");

class DiscountService{
    static async incrementUserCounts(discountId) {
        await discountRepo.increment("UserCounts", {
          where: { id: discountId },
        });
      }
}

module.exports = DiscountService