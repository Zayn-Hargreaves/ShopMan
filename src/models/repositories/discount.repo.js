const initializeModels = require("../../db/dbs/associations")
const { Op } = require("sequelize")
const { getSelectData } = require("../../utils/index")
class DiscountRepository {
  constructor(models) {
    this.Discounts = models.Discounts
    this.DiscountsProducts = models.DiscountsProducts
    this.Products = models.Products
  }
  static async incrementUserCounts(discountId) {
    await DiscountRepository.increment("UserCounts", {
      where: { id: discountId },
    });
  }
  async getAvailableDiscounts(productId) {
    const now = new Date();

    const discounts = await this.Discounts.findAll({
      where: {
        status: "active",
        StartDate: { [Op.lte]: now },
        EndDate: { [Op.gte]: now },
        UserCounts: { [Op.lt]: this.Discounts.sequelize.col("MaxUses") }
      },
      include: [
        {
          model: this.Products,
          as: "products",
          through: {
            attributes: [],
            where: { ProductId: productId }  // lọc qua bảng trung gian
          },
          attributes: [],  // không cần trả thông tin Product
          required: true
        }
      ],
      attributes: getSelectData([
        "id", "name", "desc", "value", "type",
        "code", "StartDate", "EndDate", "MinValueOrders"
      ])
    });

    return discounts;
  }
  async validateDiscountsForProduct(productId, discountIds, itemTotal) {
    if (!discountIds.length) return [];

    const discounts = await this.Discounts.findAll({
      where: {
        id: { [Op.in]: discountIds },
        status: 'active',
        StartDate: { [Op.lte]: new Date() },
        EndDate: { [Op.gte]: new Date() },
        MinValueOrders: { [Op.lte]: itemTotal },
      },
      include: [
        {
          model: this.Products,
          as: 'products',
          through: {
            attributes: [],
            where: { ProductId: productId }
          },
          attributes: [],
          required: true
        }
      ]
    });

    return discounts;
  }


  async validateShopDiscounts(shopDiscountIds, cartTotal) {
    if (!shopDiscountIds.length) return [];

    const discounts = await this.Discounts.findAll({
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