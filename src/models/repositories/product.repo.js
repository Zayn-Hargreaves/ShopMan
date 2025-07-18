const { getSelectData, getUnselectData } = require("../../utils");
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
        this.DiscountsProducts = models.DiscountsProducts
        this.Campaign = models.Campaign
        this.Inventories = models.Inventories
    }
    async findProductBySlug(slug) {
        const product = await this.Products.findOne({
            where: { slug },
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
                    model: this.Products,
                    as: 'Product',
                    attributes: ['id', 'name', 'ShopId', 'CategoryId']

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
                    as:'Product',
                    require:false
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
    async getlistProductByAdmin(ShopId, status, name, categoryId, page = 1, limit = 10, minPrice, maxPrice, sort) {
        let where = {}
        if (ShopId) where.ShopId = ShopId
        if (status) where.status = status
        if (name) where.name = { [Op.iLike]: `%${name}%` }
        if (categoryId) where.CategoryId = categoryId
        if (minPrice) where.price = { ...(where.price || {}), [Op.gte]: minPrice };
        if (maxPrice) where.price = { ...(where.price || {}), [Op.lte]: maxPrice };
        let order = [['createdAt', 'DESC']];
        if (sort === "price") order = [['price', 'ASC']];
        if (sort === "price_desc") order = [['price', 'DESC']];

        const offset = (page - 1) * limit
        const { rows, count } = await this.Products.findAndCountAll({
            where,
            limit,
            offset,
            order
        })
        return {
            items: rows,
            total: count,
            page: +page,
            limit: +limit,
            totalPages: Math.ceil(count / limit)
        }
    }

    async buildCategoryPath(CategoryId) {
        let path = []
        let current = await this.Category.findByPk(CategoryId)
        while (current) {
            path.unshift(current.id)
            if (!current.ParentId) break;
            current = await this.Category.findByPk(current.ParentId)
        }
        return path
    }
    async findCategoryById(id, options = {}) {
        return this.Category.findByPk(id, options)
    }
    async createProduct({ name, price, desc, attrs, CategoryId, discount_percentage, sort, ShopId, has_variations = "false", thumb }, options) {
        const CategoryPath = await this.buildCategoryPath(CategoryId)
        return await this.Products.create({ name, price, desc, attrs, CategoryId, discount_percentage, CategoryPath, sort, ShopId, has_variations, status: 'active', thumb }, options)
    }

    async createNewSku(ProductId, ShopId, { sku_name, sku_desc, sku_attrs, sku_specs, sku_price, sku_stock, sku_type, sort, location, sku_no, spu_no }, options) {
        const sku = await this.Sku.create({ ProductId, sku_no, sku_name, sku_desc, sku_type, status: 'active', sort, sku_stock, sku_price }, options)
        const skuAttr = await this.SkuAttr.create({ sku_no, sku_stock, sku_price, sku_attrs }, options)
        const SkuSpecs = await this.SkuSpecs.create({ sku_specs, SkuId: sku.id }, options)
        const SpuToSku = await this.SpuToSku.create({ sku_no, spu_no, ProductId }, options)
        const Inventory = await this.Inventories.create({ SkuId: sku.id, ShopId, quantity: sku_stock, location }, options)
        return {
            ...sku.toJSON(),
            ...skuAttr.toJSON(),
            ...SkuSpecs.toJSON(),
            ...SpuToSku.toJSON(),
            Inventory
        }
    }
    async findProductById(id, options = {}) {
        return await this.Products.findByPk(id, options);
    }
    async findAllSkus(ProductId, options) {
        return await this.Sku.findAll({ where: { ProductId }, ...options })
    }
    async updateSku(
        ProductId, ShopId,
        { sku_name, sku_desc, sku_attrs, sku_specs, sku_price, sku_stock, sku_type, sort, location, sku_no, spu_no },
        newSpuNo, newSkuNo,
        options = {}
    ) {
        if (newSkuNo && newSpuNo) {
            await this.Sku.update(
                { sku_no: newSkuNo, sku_name, sku_desc, sku_type, status: 'active', sort, sku_stock, sku_price },
                { where: { ProductId, sku_no }, ...options }
            );
            await this.SkuAttr.update(
                { sku_stock, sku_price, sku_attrs, sku_no: newSkuNo },
                { where: { sku_no }, ...options }
            );
            const sku = await this.Sku.findOne({ where: { ProductId, sku_no: newSkuNo }, ...options });

            await this.SkuSpecs.update(
                { sku_specs },
                { where: { SkuId: sku.id }, ...options }
            );
            await this.SpuToSku.update(
                { sku_no: newSkuNo, spu_no: newSpuNo },
                { where: { sku_no }, ...options }
            );
            await this.Inventories.update(
                { quantity: sku_stock, location },
                { where: { ShopId, SkuId: sku.id }, ...options }
            );

            return await this.getFullSku(ProductId, newSkuNo, options);
        }
        else {
            await this.Sku.update(
                { sku_name, sku_desc, sku_type, status: 'active', sort, sku_stock, sku_price },
                { where: { ProductId, sku_no }, ...options }
            );
            await this.SkuAttr.update(
                { sku_stock, sku_price, sku_attrs },
                { where: { sku_no }, ...options }
            );
            const sku = await this.Sku.findOne({ where: { ProductId, sku_no }, ...options });

            await this.SkuSpecs.update(
                { sku_specs },
                { where: { SkuId: sku.id }, ...options }
            );
            await this.SpuToSku.update(
                { spu_no },
                { where: { sku_no }, ...options }
            );
            await this.Inventories.update(
                { quantity: sku_stock, location },
                { where: { ShopId, SkuId: sku.id }, ...options }
            );

            return await this.getFullSku(ProductId, sku_no, options);
        }
    }

    async getFullSku(ProductId, sku_no, options = {}) {
        const sku = await this.Sku.findOne({
            where: { ProductId, sku_no },
            include: [
                { model: this.SkuAttr, as: 'SkuAttr', required: false },
                { model: this.SkuSpecs, as: 'SkuSpecs', required: false },
                { model: this.Inventories, as: 'inventories', required: false },
                { model: this.SpuToSku, as: 'SpuToSkus', required: false },
            ],
            ...options
        });
        return sku;
    }

    async findOneSku(sku_no, ProductId, options) {
        return await this.Sku.findOne({
            where: {
                sku_no,
                ProductId,
            },
            include: [{
                model: this.SkuAttr,
                as: 'SkuAttr'
            }], ...options
        })
    }

    async findProductDetailForAdmin(ShopId, id) {
        const product = await this.Products.findOne({
            where: { ShopId, id },
            attributes: getUnselectData(['desc_plain', 'sort', 'sale_count', 'categoryPath', 'deletedAt']),
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
                        },
                        {
                            model: this.Inventories,
                            as: "inventories",
                            require: false
                        },{
                            model:this.SpuToSku,
                        }
                    ],
                }
            ]
    });
        return product;
    }

    async findSkuById(id){
        return await this.Sku.findByPk(id)
    }
    async findProductInShop(ShopId, id){
        return await this.Products.findOne({where:{ShopId,id}})
    }
}


module.exports = ProductRepository