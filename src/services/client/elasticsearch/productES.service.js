const { NotFoundError } = require("../../../cores/error.response.js");
const analysticsRepository = require("../../../db/edb/repositories/analysticsRepository.js");
const orderRepository = require("../../../db/edb/repositories/orderRepository.js");
const ProductRepositoryEdb = require("../../../db/edb/repositories/productRepository.js");
const userEventRepository = require("../../../db/edb/repositories/userEventRepository.js");
const RepositoryFactory = require("../../../models/repositories/repositoryFactory.js")
class ElasticSearchService {
    async searchProducts({
        query,
        minPrice,
        maxPrice,
        CategoryId,
        CategorySlug,
        ShopSlug,
        sortBy = null,
        lastSortValues = null,
        pageSize = 10,
        isAndroid = false
    }) {
        await RepositoryFactory.initialize()
        const ShopRepo = RepositoryFactory.getRepository("ShopRepository")
        const CategoryRepo = RepositoryFactory.getRepository("CategoryRepository")
        let shop
        if (!ShopSlug) throw new NotFoundError("Shop not found")
        if (ShopSlug) {
            shop = await ShopRepo.findShopBySlug1(ShopSlug)
        }
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
        let categoryIds = [];
        let category
        if (CategorySlug) {
            category = await CategoryRepo.findCategoryBySlug(CategorySlug);
            if (!category) throw new Error("Category not found");

            categoryIds = await CategoryRepo.getAllDescendantCategoryIds(category.id);
        } else if (CategoryId) {
            categoryIds = await CategoryRepo.getAllDescendantCategoryIds(CategoryId);
        }
        const filters = {
            minPrice: minPrice !== undefined ? Number(minPrice) : undefined,
            maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,
            category: category !== undefined ? Number(category.id) : undefined,
            shop: shop !== undefined ? Number(shop.id) : undefined,
            categoryPath: categoryIds.length > 0 ? categoryIds : undefined
        };
        const result = await ProductRepositoryEdb.searchProducts({
            query,
            filters,
            sortBy,
            lastSortValues,
            pageSize,
            isAndroid
        });
        return {
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
    async GetListOrderES({
        userId,
        shopId,
        filters,
        sortBy,
        lastSortValues,
        pageSize = 20,
        isAdmin
    }) {
        const result = await orderRepository.searchOrders({
            userId,
            shopId,
            filters,
            sortBy,
            lastSortValues,
            pageSize,
            isAdmin
        })
        return {
            data: result.results,
            total: result.total,
            suggest: result.suggest,
            lastSortValues: result.results.length > 0 ? result.results[result.results.length - 1].sortValues : null
        }
    }
}

module.exports = new ElasticSearchService();