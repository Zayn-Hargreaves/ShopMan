const { buildCombinedRevenueAggregation, buildRevenueAggregation, buildTopProductsAggregation } = require("../aggregations/revenueAggregation");
const { getClient } = require("../edb");

class OrderRepository{
    async getRevenue({interval = 'month', shopId = null}){
        const client = await getClient()
        const body = {
            query: shopId ? {bool:{filter:{term:{ShopId:shopId}}}}:{match_all:{}},
            aggs:interval === 'combined' ? buildCombinedRevenueAggregation() :buildRevenueAggregation({interval})
        }
        const response = await client.search({index:'orders',body})
        if(interval === 'combined'){
            return response.aggregations.by_year.buckets.map(year=> ({
                year:year.key_as_string,
                totalRevenue:year.total_revenue.value,
                months: year.by_month.buckets.map(month=>({
                    month:month.key_as_string,
                    totalRevenue:month.total_revenue.value
                }))
            }))
        }
        return response.aggregations[`by_${interval}`].buckets.map(bucket =>({
            period:bucket.key_as_string,
            totalRevenue:bucket.total_revenue.value
        }))
    }
    async getTopProducts({metric='quantity', shopId =null}){
        const client = await getClient()
        const body = {
            query:shopId ? {bool:{filter:{term:{ShopId:shopId}}}}:{match_all:{}},
            aggs:buildTopProductsAggregation({metric})    
        }
        const response = await client.search({index:'orders', body})
        const buckets = response.aggregations.by_order_details.by_product.buckets
        return buckets.map(bucket =>({
            productId:bucket.key,
            [metric]:metric === 'quantity' ? bucket.total_quantity.value : bucket.total_revenue.value
        }))
    }
}

module.exports = new OrderRepository()