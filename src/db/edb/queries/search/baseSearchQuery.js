const buildBaseSearchQuery = ({ query, filters = {} }) => {
    const boolQuery = {
        bool: {
            must: query
                ? {
                    multi_match: {
                        query,
                        fields: ['name^3', 'desc_plain'],
                        fuzziness: 'AUTO',
                        analyzer: 'search_analyzer' 
                    }
                }
                : { match_all: {} },
            filter: [
                { term: { status: 'active' } },
                filters.minPrice || filters.maxPrice
                    ? {
                        range: {
                            price: {
                                gte: filters.minPrice,
                                lte: filters.maxPrice
                            }
                        }
                    }
                    : {},
                filters.CategoryId ? { term: { CategoryId: filters.CategoryId } } : {},
                filters.ShopId ? { term: { ShopId: filters.ShopId } } : {}
            ].filter(f => Object.keys(f).length > 0) // Loại bỏ filter rỗng
        }
    };

    return boolQuery;
};

module.exports = { buildBaseSearchQuery };