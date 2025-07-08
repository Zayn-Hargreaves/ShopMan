const { getClient } = require("../edb");
class OrderRepositoryEdb {
    async searchOrders({
        userId,
        shopId,
        filters = {},
        sortBy = { field: "createdAt", order: "desc" },
        lastSortValues,
        pageSize = 20,
        isAdmin = false
    }) {
        const client = await getClient();
        const must = [];
        if (userId) must.push({ term: { userId } });
        if (shopId) must.push({ term: { shopId } });
        // Thêm các filter tuỳ nhu cầu: status, date, city, v.v.
        if (filters.status) must.push({ term: { status: filters.status } });
        // ... (các filter khác)
        const body = {
            size: pageSize,
            query: { bool: { must } },
            sort: [
                { [sortBy.field]: sortBy.order },
                { orderId: "desc" }
            ],
            _source: [
                // Chọn field cần thiết cho mobile/app hoặc admin
                "orderId", "userId", "shopId", "totalPrice", "status", "createdAt",
                "shippingProvider", "shippingTrackingCode", "products"
            ]
        };
        if (lastSortValues) body.search_after = lastSortValues;

        const resp = await client.search({ index: "orders", body });
        return {
            results: resp.hits.hits.map(hit => ({
                ...hit._source,
                sortValues: hit.sort
            })),
            total: resp.hits.total.value
        };
    }
}

module.exports = new OrderRepositoryEdb()