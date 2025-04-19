const { NotFoundError } = require("../cores/error.response");
const analysticsRepository = require("../db/edb/repositories/analysticsRepository");
const ProductRepositoryEdb = require("../db/edb/repositories/productRepository");
const userEventRepository = require("../db/edb/repositories/userEventRepository");
const ShopRepo = require("../models/repositories/shop.repo.js")
const CategoryRepo = require("../models/repositories/category.repo.js")
class ElasticSearchService {
    async searchProducts({
        query,
        minPrice,
        maxPrice,
        CategorySlug,
        ShopSlug,
        sortBy = null,
        lastSortValues = null,
        pageSize = 10,
        isAndroid = false
    }) {
        const shop = await ShopRepo.findShopBySlug(CategorySlug)
        const category = await CategoryRepo.findCategoryBySlug(ShopSlug)
        if (minPrice !== undefined && (isNaN(minPrice) || minPrice < 0)) {
            throw new Error("minPrice must be a non-negative number");
        }
        if (maxPrice !== undefined && (isNaN(maxPrice) || maxPrice < 0)) {
            throw new Error("maxPrice must be a non-negative number");
        }
        if (pageSize !== undefined && (isNaN(pageSize) || pageSize <= 0)) {
            throw new Error("pageSize must be a positive number");
        }
        if (sortBy && (!sortBy.field || !['price', 'rating', 'createdAt', 'sale_count'].includes(sortBy.field))) {
            throw new Error("sortBy.field must be one of: price, rating, createdAt, sale_count");
        }
        if (sortBy && sortBy.order && !['asc', 'desc'].includes(sortBy.order)) {
            throw new Error("sortBy.order must be 'asc' or 'desc'");
        }

        const filters = {
            minPrice: minPrice !== undefined ? Number(minPrice) : undefined,
            maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,
            category: category.id !== undefined ? Number(category.id) : undefined,
            shop: shop.id !== undefined ? Number(category.id) : undefined
        };
        const result = await ProductRepositoryEdb.searchProducts({
            query,
            filters,
            sortBy,
            lastSortValues,
            pageSize,
            isAndroid
        });
        return{
            data: result.results,
            total: result.total,
            suggest: result.suggest,
            lastSortValues: result.results.length > 0 ? result.results[result.results.length - 1].sortValues : null
        }
    }

    async getRevenueAnalystic({ interval = 'month', shopId }) {
        return await analysticsRepository.getRevenue({ interval, shopId });
    }

    async getTopProduct({ metric = 'quantity' }) {
        return await analysticsRepository.getTopProducts({ metric });
    }

    async trackingUserEvent({ event_type, user_id, product_id, timestamp }) {
        await userEventRepository.trackUserEvent({ event_type, user_id, product_id, timestamp });
    }
}

module.exports = new ElasticSearchService();