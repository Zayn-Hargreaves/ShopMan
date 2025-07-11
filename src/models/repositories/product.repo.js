const { getSelectData } = require("../../utils");
const { Op, Sequelize, where, col } = require("sequelize")
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

    async getDealOfTheDayProducts(cursor = null, limit = 10, minPrice, maxPrice, minRating, sortBy) {
        const where = {
            status: 'active',
            ...(cursor && { id: { [Op.lte]: cursor } }),
            ...(minPrice && { price: { [Op.gte]: minPrice } }),
            ...(maxPrice && { price: { [Op.lte]: maxPrice } }),
            ...(minRating && { rating: { [Op.gte]: minRating / 10 } }), // Chuyển 40/45 thành 4.0/4.5
        };

        let order = [['id', 'DESC']];
        if (sortBy) {
            switch (sortBy) {
                case 'popularity':
                    order = [['sale_count', 'DESC']];
                    break;
                case 'price_asc':
                    order = [Sequelize.literal('price * (1 - COALESCE(discount_percentage, 0) / 100) ASC')];
                    break;
                case 'price_desc':
                    order = [Sequelize.literal('price * (1 - COALESCE(discount_percentage, 0) / 100) DESC')];
                    break;
                case 'rating':
                    order = [['rating', 'DESC']];
                    break;
            }

        }

        const products = await this.Products.findAll({
            where,
            limit: Number(limit) + 1,
            order,
            include: [
                {
                    model: this.Discounts,
                    as: 'discounts',
                    through: { attributes: [] },
                    where: {
                        status: 'active',
                        // startDate: { [Op.lte]: new Date() },
                        // endDate: { [Op.gte]: new Date() },
                    },
                }
            ],
        });

        const nextCursor = products.length > limit ? products[products.length - 1].id : null;
        return {
            products: products.slice(0, limit),
            nextCursor,
        };
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
                {
                    model: this.SpuToSku,
                    include:{
                        model: this.Products,
                        as:'Product',
                        attributes: ['id', 'name', 'ShopId', 'CategoryId']
                    }
                }
            ]
        });
    }
    async increaseSaleCount(productId, quantity) {
        return await this.Products.increment(
            { sale_count: quantity },
            { where: { id: productId } }
        );
    }
    async getProductSkus(productId) {
        const skus = await this.Sku.findAll({
            where: { ProductId: productId, status: 'active' },
            include: [
                {
                    model: this.SkuAttr,
                    as: "SkuAttr",
                    required: false,
                },
                {
                    model: this.Products,
                },
                {
                    model: this.SkuSpecs,
                    as: "SkuSpecs",
                    required: false,
                }
            ],
            attributes: [
                "id",
                "sku_no",
                "sku_name",
                "sku_desc",
                "sku_price",
                "sku_stock",
                "sku_type",
                "sort"
            ],
            order: [["sort", "ASC"], ["id", "ASC"]]
        });

        // Format lại trả ra cho FE
        return skus.map(sku => ({
            skuId: sku.id,
            skuNo: sku.sku_no,
            name: sku.sku_name,
            desc: sku.sku_desc,
            price: sku.sku_price,
            stock: sku.sku_stock,
            type: sku.sku_type,
            sort: sku.sort,
            image: sku.sku_image || sku.SkuAttr?.sku_image, // nếu có
            attrs: sku.SkuAttr?.sku_attrs || {},
            specs: sku.SkuSpecs?.sku_specs || {}
        }));
    }
    async incrementStock(SkuId, quantity, options = {}) {
        return await this.Sku.increment(
            { sku_stock: quantity },
            { where: { id: SkuId }, ...options }
        );
    }

    async findSkuBySkuNo(sku_no, options = {}) {
        return await this.Sku.findOne({
            where: {
                sku_no
            },
            ...options
        })
    }
}


module.exports = ProductRepository