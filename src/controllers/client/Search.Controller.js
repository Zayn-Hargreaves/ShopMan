const { OkResponse } = require("../../cores/success.response")
const ElasticSearchService = require("../../services/client/elasticsearch/productES.service")

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
        const { slug } = req.params;
        const { minPrice, maxPrice, sortBy, lastSortValues, pageSize, isAndroid } = req.query;
        new OkResponse({
            message: "Get products by category successfully",
            metadata: await ElasticSearchService.searchProducts({
                CategorySlug: slug,
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined,
                sortBy: sortBy ? JSON.parse(sortBy) : undefined,
                lastSortValues: lastSortValues ? JSON.parse(lastSortValues) : undefined,
                pageSize: pageSize ? Number(pageSize) : undefined,
                isAndroid: isAndroid === 'true'
            })
        }).send(res);
    }
    getProductByCategoryId = async (req, res, next) => {
        const CategoryId = req.params.CategoryId
        const { minPrice, maxPrice, sortBy, lastSortValues, pageSize, isAndroid } = req.query;
        new OkResponse({
            message: "Get products by category successfully",
            metadata: await ElasticSearchService.searchProducts({
                CategoryId:CategoryId,
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined,
                sortBy: sortBy ? JSON.parse(sortBy) : undefined,
                lastSortValues: lastSortValues ? JSON.parse(lastSortValues) : undefined,
                pageSize: pageSize ? Number(pageSize) : undefined,
                isAndroid: isAndroid === 'true'
            })
        }).send(res);
    }

    getProductByShop = async (req, res, next) => {
        const { slug } = req.params;
        const { minPrice, maxPrice, sortBy, lastSortValues, pageSize, isAndroid } = req.query;
        new OkResponse({
            message: "Get products by shop successfully",
            metadata: await ElasticSearchService.searchProducts({
                query: undefined,
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined,
                CategorySlug: undefined,
                ShopSlug: slug,
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
                query:null,
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined,
                CategoryId:null,
                CategorySlug:null,
                ShopSlug:null,
                sortBy: sortBy ? JSON.parse(sortBy) : undefined,
                lastSortValues: lastSortValues ? JSON.parse(lastSortValues) : undefined,
                pageSize: pageSize ? Number(pageSize) : undefined,
                isAndroid: isAndroid === 'true'
            })
        }).send(res);
    }
}

module.exports = new SearchController()