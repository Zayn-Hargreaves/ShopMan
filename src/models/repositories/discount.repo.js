const initializeModels = require("../../db/dbs/associations")
const { Op, where } = require("sequelize")
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
  async getAllDiscount(ShopId, status, type, code, from, to, page, limit) {
    let where = {}
    if (status) where.status = status
    if (type) where.type = type
    if (code) where.code = code
    if (from || to) {
      where.StartDate = {}
      if (from) where.StartDate[Op.gte] = new Date(from)
      if (to) where.EndDate[Op.lte] = new Date(to)
    }
    if (ShopId) {
      where.ShopId = ShopId
    }
    const offset = (page - 1) * limit
    const { rows, count } = await this.Discounts.findAndCountAll({
      where,
      limit,
      offset,
      order: [["StartDate"], 'desc']
    })
    return {
      items: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    }
  }
  async addDiscount(data) {

    const newDiscount = this.Discounts.create({
      ...data,
      status: 'active'
    })
    const productIds = data.productIds
    for (const ProductId of productIds) {
      await this.DiscountsProducts.create({ ProductId, DiscountId: newDiscount.id })
    }
    return newDiscount
  }
  async updateDiscount(id, data) {
    const productIds = data.productIds
    const holderDiscountProduct = await this.DiscountsProducts.findAll({ where: { DiscountId: id } })
    const holderProductIds = holderDiscountProduct.map(DiscountProduct => DiscountProduct.ProductId)

    const toRemove = holderProductIds.filter(id => !productIds.includes(id))
    const toAdd = productIds.filter(id => !holderProductIds.includes(id))
    if (toRemove.length > 0) {
      await this.DiscountsProducts.destroy({ where: { DiscountId: id, ProductId: toRemove } })
    }
    console.log("test")
    if (toAdd > 0) {
      await this.DiscountsProducts.bulkCreate(toAdd.map(pid => ({ DiscountId: id, ProductId: pid })))
    }
    return 1
  }

  async getDetailDiscount(ShopId, id) {
    let where = { id }
    if (ShopId) {
      where.ShopId = ShopId
    }
    return await this.Discounts.findOne({
      where: where,
      include: [
        {
          model: this.Products,
          as: 'products',
          where: {
            status: 'active',
          },
          required: false
        }
      ]
    });

  }
  async checkDiscount(discountIds, ShopId) {
    const count = await this.Discounts.count({
      where: {
        id: discountIds,
        [Op.or]: [
          { ShopId: ShopId },
          { ShopId: null }
        ]
      }
    });
    return count == discountIds.length
  }
  async getProductCampaign(CampaignId, page, limit) {
    // 1. Lấy DiscountIds của campaign
    const discounts = await this.Discounts.findAll({
      where: { CampaignId },
      attributes: ['id'],
    });
    const discountIds = discounts.map(d => d.id);

    if (discountIds.length === 0) {
      return { products: [], total: 0, totalPages: 0 };
    }

    // 2. Lấy các ProductId qua DiscountsProducts mapping
    const discountProducts = await this.DiscountsProducts.findAll({
      where: { DiscountId: { [Op.in]: discountIds } },
      attributes: ['ProductId'],
    });
    const productIds = discountProducts.map(dp => dp.ProductId);

    if (productIds.length === 0) {
      return { products: [], total: 0, totalPages: 0 };
    }

    // 3. Phân trang Products
    const offset = (page - 1) * limit;
    const { count, rows } = await this.Products.findAndCountAll({
      where: { id: { [Op.in]: productIds }, status: 'active' },
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    return {
      products: rows,
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
    };
  }
}


module.exports = DiscountRepository