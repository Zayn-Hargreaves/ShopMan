const initializeModels = require('../../dbs/associations')
const { Products, Discounts, ProductVariation, DiscountsProducts } = await initializeModels
const {getClient} = require("../edb")
const bulkSyncProduct = async () => {
    const products = await Products.findAll({
        include: [
            { model: ProductVariation, as: 'variations' },
            {
                model: Discounts,
                as: 'discounts',
                through: { model: DiscountsProducts }
            }
        ]
    })
    const body = products.flatMap(product => {
        return [
            { index: { _index: 'products', _id: product.id } },
            {
                id: product.id,
                name: product.name,
                desc: product.desc,
                price: product.price,
                thumb: product.thumb,
                type: product.type,
                status: product.status,
                category_id: product.CategoryId,
                shop_id: product.ShopId,
                product_rating: product.product_rating,
                sale_count: product.sale_count,
                variations: product.variations.map(variation => ({
                    id: variation.id,
                    sku: variation.sku,
                    price: variation.price,
                    quantity: variation.quantity,
                    attributes: variation.attributes
                })),
                discounts: product.discounts.map(discount => ({
                    id: discount.id,
                    name: discount.name,
                    value: discount.value,
                    type: discount.type,
                    start_date: discount.StartDate,
                    end_date: discount.EndDate
                }))
            }
        ]
    })
    const client = await getClient()
    await client.bulk({body,refresh:true})
}

module.exports = {bulkSyncProduct}

// chay cron job de dong bo
