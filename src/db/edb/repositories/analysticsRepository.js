const { BadRequestError } = require("../../../cores/error.response");
const { getClient } = require("../edb");
class AnalyticsRepository {
    async getRevenue(ShopId, query) {
        const client = await getClient()
        const { interval = 'day', from, to } = query
        let must = [];
        if (from || to) {
            must.push({
                range: {
                    createdAt: {
                        ...(from ? { gte: from } : {}),
                        ...(to ? { lte: to } : {}),
                    }
                }
            });
        }
        const filterShop = ShopId ? { term: { "products.shopId": Number(ShopId) } } : { match_all: {} };

        const result = await client.search({
            index: 'orders',
            size: 0,
            body: {
                query: {
                    bool: { must }
                },
                aggs: {
                    by_day: {
                        date_histogram: {
                            field: 'createdAt',
                            calendar_interval: interval
                        },
                        aggs: {
                            products: {
                                nested: { path: "products" },
                                aggs: {
                                    filter_shop: {
                                        filter: filterShop,
                                        aggs: {
                                            revenue: { sum: { field: "products.itemTotal" } }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        const buckets = result.aggregations?.by_day?.buckets || [];

        // Optional: log toàn bộ buckets để debug
        console.log('Revenue buckets:', JSON.stringify(buckets, null, 2));
        if (!result) {
            throw new BadRequestError("Something went wrong")
        }
        // Đảm bảo không lỗi khi truy cập nested (nếu ngày nào không có sản phẩm của shop đó, revenue là 0)
        const data = buckets.map(b => ({
            date: b.key_as_string,
            revenue: b.products?.filter_shop?.revenue?.value ?? 0
        }));
        return data
    }
    async getOrderStatus(ShopId, query) {
        const client = await getClient()

        const { from, to } = query
        let must = [];
        if (from || to) {
            must.push({
                range: {
                    createdAt: {
                        ...(from ? { gte: from } : {}),
                        ...(to ? { lte: to } : {}),
                    }
                }
            });
        }
        const filterShop = ShopId ? { term: { "products.shopId": Number(ShopId) } } : { match_all: {} };

        // Lọc order có ít nhất 1 sản phẩm thuộc shopId (nested+reverse_nested)
        const result = await client.search({
            index: 'orders',
            size: 0,
            body: {
                query: {
                    bool: {
                        must
                    }
                },
                aggs: {
                    products: {
                        nested: { path: "products" },
                        aggs: {
                            filter_shop: {
                                filter: filterShop,
                                aggs: {
                                    to_order: {
                                        reverse_nested: {},
                                        aggs: {
                                            by_status: {
                                                terms: { field: "status", size: 10 }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if(!result){
            throw new BadRequestError("Something went wrong")
        }
        const buckets = result.aggregations.products.filter_shop.to_order.by_status.buckets;
        return (buckets.map(b => ({
            status: b.key,
            count: b.doc_count
        })));
    }
    async getTopProduct(ShopId, query) {
        const { from, to, size = 10} = query

        const client = await getClient();

        let dateRange = {};
        if (from || to) {
            dateRange = {
                range: {
                    createdAt: {
                        ...(from ? { gte: from } : {}),
                        ...(to ? { lte: to } : {}),
                    }
                }
            }
        }
        const filterShop = ShopId ? { term: { "products.shopId": Number(ShopId) } } : { match_all: {} };

        const result = await client.search({
            index: 'orders',
            size: 0,
            body: {
                query: {
                    bool: {
                        must: [
                            ...(from || to ? [dateRange] : [])
                        ]
                    }
                },
                aggs: {
                    products: {
                        nested: { path: "products" },
                        aggs: {
                            filter_shop: {
                                filter: filterShop,
                                aggs: {
                                    top_products: {
                                        terms: {
                                            field: "products.productName.keyword",
                                            size: Number(size)
                                        },
                                        aggs: {
                                            total_sold: { sum: { field: "products.quantity" } },
                                            revenue: { sum: { field: "products.itemTotal" } }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        if(!result){
            throw new BadRequestError("Something went wrong")
        }
        const buckets = result.aggregations.products.filter_shop.top_products.buckets;
        return (buckets.map(b => ({
            productName: b.key,
            total_sold: b.total_sold.value,
            revenue: b.revenue.value
        })));

    }
}


module.exports = new AnalyticsRepository()