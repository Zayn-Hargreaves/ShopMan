const { OkResponse } = require("../cores/success.response")
const ElasticSearchService = require("../services/ElasticSearch.service")

class SearchController {
    SearchProducts = async (req, res, next) => {
        const {
            query,
            minPrice,
            maxPrice,
            CategoryId,
            ShopId,
            sortBy,
            lastSortValues,
            pageSize,
            isAndroid
        } = req.query;

        new OkResponse({
            message: "Search products successfully",
            metadata: await ElasticSearchService.searchProducts({
                query,
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined,
                CategoryId: CategoryId ? Number(CategoryId) : undefined,
                ShopId: ShopId ? Number(ShopId) : undefined,
                sortBy: sortBy ? JSON.parse(sortBy) : undefined,
                lastSortValues: lastSortValues ? JSON.parse(lastSortValues) : undefined,
                pageSize: pageSize ? Number(pageSize) : undefined,
                isAndroid: isAndroid === 'true'
            })
        }).send(res);
    }

    getProductByCategory = async (req, res, next) => {
        const { categoryId } = req.params;
        const { minPrice, maxPrice, sortBy, lastSortValues, pageSize, isAndroid } = req.query;
        new OkResponse({
            message: "Get products by category successfully",
            metadata: await ElasticSearchService.searchProducts({
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined,
                category: Number(categoryId),
                sortBy: sortBy ? JSON.parse(sortBy) : undefined,
                lastSortValues: lastSortValues ? JSON.parse(lastSortValues) : undefined,
                pageSize: pageSize ? Number(pageSize) : undefined,
                isAndroid: isAndroid === 'true'
            })
        }).send(res);
    }

    getProductByShop = async (req, res, next) => {
        const { shopId } = req.params;
        const { minPrice, maxPrice, sortBy, lastSortValues, pageSize, isAndroid } = req.query;
        new OkResponse({
            message: "Get products by shop successfully",
            metadata: await ElasticSearchService.searchProducts({
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined,
                shop: Number(shopId),
                sortBy: sortBy ? JSON.parse(sortBy) : undefined,
                lastSortValues: lastSortValues ? JSON.parse(lastSortValues) : undefined,
                pageSize: pageSize ? Number(pageSize) : undefined,
                isAndroid: isAndroid === 'true'
            })
        }).send(res);
    }
    getProductList = async (req, res, next) => {
        const { minPrice, maxPrice, sortBy, lastSortValues, pageSize, isAndroid } = req.query;
        new OkResponse({
            message: "Get products list successfully",
            metadata: await ElasticSearchService.searchProducts({
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined,
                sortBy: sortBy ? JSON.parse(sortBy) : undefined,
                lastSortValues: lastSortValues ? JSON.parse(lastSortValues) : undefined,
                pageSize: pageSize ? Number(pageSize) : undefined,
                isAndroid: isAndroid === 'true'
            })
        }).send(res);
    }
}

module.exports = new SearchController()