const initializeModels = require("../../db/dbs/associations");
const { getSelectData } = require("../../utils");
class ProductRepository {
    constructor(models) {
        this.Products = models.Products
        this.Category = models.Category,
            this.SpuToSku = models.SpuToSku,
            this.Sku = models.Sku,
            this.SkuAttr = models.SkuAttr,
            this.SkuSpec = models.SkuSpec
    }
    async findAll(limit, skip) {
        return this.model.findAll({
            limit,
            offset: skip,
            include: [{ all: true }]
        })
    }
    async findById(id) {
        return this.model.findByPk(id,
            {
                includes: [
                    {
                        model: this.model.ProductVariation
                    }
                ]
            }
        )
    }
    async findProductBySlug(slug) {
        const product = await this.Products.findOne({
            where: { slug },
            include: [
                {
                    model: this.SpuToSku,
                    as: 'SpuToSku',
                    required: false,
                    include: [
                        {
                            model: this.Sku,
                            as: 'Sku',
                            required: false,
                            include:[
                                {
                                    model: this.SkuAttr,
                                    as: 'SkuAttr',
                                    required: false,
                                },
                                {
                                    model: this.SkuSpec,
                                    as: 'SkuSpec',
                                    required: false,
                                }
                            ]
                        },
                    
                    ]
                }
            ],
            raw:true,
        })
        return product
    }
    async update(id, payload) {
        const record = await this.model.findByPk({ id })
        if (!record) return null
        return record.update(payload)
    }
    async findByCategorySlug(categorySlug, limit = 10, skip = 0) {
        const products = await this.model.findAll({
            attributes: getSelectData(['id', 'name', 'thumb', 'rating', 'sale_count', 'slug', 'CategoryId']),
            include: [
                {
                    model: this.model.Category,
                    where: { slug: categorySlug },
                    attributes: []
                },
            ],
            limit,
            offset: skip,
            raw: true
        })
        return products
    }
}


module.exports = async () => {
    const models = await initializeModels()
    return new ProductRepository(models)
}