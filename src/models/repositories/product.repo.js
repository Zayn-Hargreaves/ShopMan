const { getSelectData } = require("../../utils");
const { Op } = require("sequelize")
class ProductRepository {
    constructor(models) {
        this.Products = models.Products
        this.Category = models.Category
        this.SpuToSku = models.SpuToSku
        this.Sku = models.Sku
        this.SkuAttr = models.SkuAttr
        this.SkuSpecs = models.SkuSpecs
        this.Wishlists = models.Wishlists
        this.Discounts = models.Discounts
        this.Category = models.Category
        this.DiscountsProducts = models.DiscountsProducts
        this.Campaign = models.Campaign
    }
    async findProductBySlug(slug) {
        const product = await this.Products.findOne({
            where: { slug },
            include: [
                {
                    model: this.SpuToSku,
                    as: 'SpuToSkus',
                    required: false,
                    include: [
                        {
                            model: this.Sku,
                            as: 'Sku',
                            required: false,
                            include: [
                                {
                                    model: this.SkuAttr,
                                    as: 'SkuAttr',
                                    required: false,
                                },
                                {
                                    model: this.SkuSpecs,
                                    as: 'SkuSpecs',
                                    required: false,
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        return product;
    }

    async getDealOfTheDayProducts(page = 1, limit = 10) {

        const offset = (page - 1) * limit;
        const { count, rows } = await this.Products.findAndCountAll({
            where: {
                status: 'active',
            },
            offset,
            limit,
            order: [["sale_count", "DESC"]],
            include: [
                {
                    model: this.Discounts,
                    as: 'discounts',
                    through: { attributes: [] },
                    where: {
                        status: "active",
                        StartDate: { [Op.lte]: new Date() },
                        EndDate: { [Op.gte]: new Date() },
                    }
                }
            ]
        });
        return {
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            products: rows
        }
    }

    async getAllDealProducts(page = 1, limit = 20) {
        const offset = (page - 1) * limit
        const { count, rows } = await this.Products.findAndCountAll({
            include: [
                {
                    model: this.Discounts,
                    through: { attributes: [] },
                    as: "discounts",
                    where: {
                        status: 'active',
                        StartDate: { [Op.lte]: new Date() },
                        EndDate: { [Op.gte]: new Date() },
                    }
                }
            ],
            where: {
                status: "active"
            },
            offset,
            limit: limit,
            order: [['sale_count', "DESC"]],
        })

        return {
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            products: rows
        }
    }
    async getProductMetrics(productIds) {
        return await this.Products.findAll({
            where: {
                id: productIds,
                status: 'active'
            },
            attributes: getSelectData(['id', 'sale_count'])
        })
    }
    async findProductByIds(productIds) {
        return await this.Products.findAll({
            where: {
                id: productIds,
                status: 'active'
            },
            attributes: getSelectData(['id', 'slug', 'name', 'sale_count', 'price', 'discount_percentage', 'thumb', 'rating', 'sale_count']),
        })
    }
    async findNewArrivalsProduct(page, limit) {
        const offset = (page - 1) * limit
        const { count, rows } = await this.Products.findAndCountAll({
            where: {
                status: "active",
            },
            attributes: getSelectData(['id', 'slug', 'name', 'price', 'discount_percentage', 'thumb', 'rating', 'sale_count', 'rating']),
            order: [['createdAt', 'DESC']],
            offset,
            limit: limit
        })
        return {
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            products: rows
        }
    }
    async getProductWithSku(productId, skuNo) {
        return await this.Sku.findOne({
            where: { ProductId: productId, sku_no: skuNo },
            include: [
                { model: this.SkuAttr, as: 'SkuAttr' },
                { model: this.SkuSpecs, as: 'SkuSpecs' },
            ]
        });
    }
    async increaseSaleCount(productId, quantity) {
        return await this.Products.increment(
            { sale_count: quantity },
            { where: { id: productId } }
        );
    }
}


module.exports = ProductRepository