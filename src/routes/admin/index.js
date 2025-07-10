const router = require("express").Router()
const { getClient } = require("../../db/edb/edb");
router.get('/:shopId/revenue', async (req, res) => {
    const client = await getClient()

    const { shopId } = req.params;
    const { interval = 'day', from, to } = req.query;

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

    const query = {
        bool: {
            must: [
                { term: { shopId: Number(shopId) } },
                ...(from || to ? [dateRange] : [])
            ]
        }
    };

    try {
        const result = await client.search({
            index: 'orders',
            size: 0,
            body: {
                query,
                aggs: {
                    revenue_over_time: {
                        date_histogram: {
                            field: 'createdAt',
                            calendar_interval: interval
                        },
                        aggs: {
                            total_revenue: { sum: { field: 'totalPrice' } },
                            order_count: { value_count: { field: 'orderId' } }
                        }
                    }
                }
            }
        });
        res.json(result.body.aggregations.revenue_over_time.buckets.map(bucket => ({
            date: bucket.key_as_string,
            total_revenue: bucket.total_revenue.value,
            order_count: bucket.order_count.value
        })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get('/:shopId/order-status', async (req, res) => {
    const { shopId } = req.params;
    const { from, to } = req.query;
    const client = await getClient()

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

    const query = {
        bool: {
            must: [
                { term: { shopId: Number(shopId) } },
                ...(from || to ? [dateRange] : [])
            ]
        }
    };

    try {
        const result = await client.search({
            index: 'orders',
            size: 0,
            body: {
                query,
                aggs: {
                    order_status: {
                        terms: { field: 'status', size: 10 }
                    }
                }
            }
        });
        res.json(result.body.aggregations.order_status.buckets.map(bucket => ({
            status: bucket.key,
            count: bucket.doc_count
        })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:shopId/top-products', async (req, res) => {
    const { shopId } = req.params;
    const { from, to, size = 10 } = req.query;
    const client = await getClient()

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

    const query = {
        bool: {
            must: [
                { term: { shopId: Number(shopId) } },
                ...(from || to ? [dateRange] : [])
            ]
        }
    };

    try {
        const result = await client.search({
            index: 'orders',
            size: 0,
            body: {
                query,
                aggs: {
                    products: {
                        nested: { path: "products" },
                        aggs: {
                            top_products: {
                                terms: { field: "products.productName.keyword", size: Number(size) },
                                aggs: {
                                    total_sold: { sum: { field: "products.quantity" } }
                                }
                            }
                        }
                    }
                }
            }
        });

        const buckets = result.body.aggregations.products.top_products.buckets;
        res.json(buckets.map(b => ({
            productName: b.key,
            total_sold: b.total_sold.value
        })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router