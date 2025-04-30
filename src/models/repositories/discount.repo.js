const initializeModels = require("../../db/dbs/associations")
class DiscountRepository {
  constructor(models) {
    this.Discounts = models.Discounts
  }
  static async incrementUserCounts(discountId) {
    await DiscountRepository.increment("UserCounts", {
      where: { id: discountId },
    });
  }
  async validateDiscountsForProduct(productId, discountIds, itemTotal) {
    if (!discountIds.length) return [];

    const discounts = await this.Discount.findAll({
      where: {
        id: { [Op.in]: discountIds },
        status: 'active',
        StartDate: { [Op.lte]: new Date() },
        EndDate: { [Op.gte]: new Date() },
        MinValueOrders: { [Op.lte]: itemTotal },
      },
      include: [
        {
          model: this.DiscountProduct,
          as: 'DiscountsProducts',
          where: { ProductId: productId },
        },
      ]
    });

    return discounts;
  }

  async validateShopDiscounts(shopDiscountIds, cartTotal) {
    if (!shopDiscountIds.length) return [];

    const discounts = await this.Discount.findAll({
      where: {
        id: { [Op.in]: shopDiscountIds },
        status: 'active',
        StartDate: { [Op.lte]: new Date() },
        EndDate: { [Op.gte]: new Date() },
        MinValueOrders: { [Op.lte]: cartTotal },
      }
    });

    return discounts;
  }
}


module.exports = DiscountRepository