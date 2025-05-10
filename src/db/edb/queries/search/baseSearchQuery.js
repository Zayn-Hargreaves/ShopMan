const buildBaseSearchQuery = ({ query, filters }) => {
    const must = [];
    const filter = [];

    if (query) {
        must.push({
            multi_match: {
                query,
                type: "bool_prefix",
                fields: [
                    "name.suggest",
                    "name.suggest._2gram",
                    "name.suggest._3gram"
                ]
            }
        });
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        filter.push({
            range: {
                price: {
                    gte: filters.minPrice ?? 0,
                    lte: filters.maxPrice ?? Number.MAX_SAFE_INTEGER
                }
            }
        });
    }

    if (filters.categoryPath && Array.isArray(filters.categoryPath)) {
        filter.push({ terms: { CategoryPath: filters.categoryPath } });
    } else if (filters.category !== undefined) {
        filter.push({ term: { CategoryId: filters.category } });
    }

    if (filters.shop !== undefined) {
        filter.push({ term: { ShopId: filters.shop } });
    }

    return {
        bool: {
            must,
            filter
        }
    };
};

module.exports = { buildBaseSearchQuery };
