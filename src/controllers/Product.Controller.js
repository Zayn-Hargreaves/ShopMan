const { OkResponse } = require("../cores/success.response");
const CommentService = require("../services/Comment.service");
const ProductService = require("../services/Product.service")
const ElasticSearchService = require("../services/ElasticSearch.service")
class ProductController {
    getProductDetail = async (req, res, next) => {
        const { slug } = req.params
        const userId = req.userId ? req.userId : undefined;
        new OkResponse({
            message: "get product detail success",
            metadata: await ProductService.getProductDetail(slug, userId)
        }).send(res)
    }
    getDealOfTheDay = async (req, res, next) => {
        const { minPrice, maxPrice, sortBy, lastSortValues, pageSize, isAndroid } = req.query;
        new OkResponse({
            message: "Get deal of the day successfull",
            metadata: await ElasticSearchService.searchProducts({
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined,
                sortBy: sortBy ? JSON.parse(sortBy) : undefined,
                lastSortValues: lastSortValues ? JSON.parse(lastSortValues) : undefined,
                pageSize: pageSize ? Number(pageSize) : undefined,
                isAndroid: isAndroid
            })
        }).send(res);
    }

    getTrendingProducts = async (req, res, next) => {
        const { cursorScore = "+inf", limit = 10 } = req.query;
        new OkResponse({
            message: "get trending products by cursor success",
            metadata: await ProductService.getTrendingProductsByCursor(cursorScore, parseInt(limit)),
        }).send(res);
    }

    getNewArrivals = async (req, res, next) => {
        const { minPrice, maxPrice, sortBy, lastSortValues, pageSize, isAndroid } = req.query;
        new OkResponse({
            message: "Get products list successfully",
            metadata: await ElasticSearchService.searchProducts({
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined,
                sortBy: sortBy ? JSON.parse(sortBy) : undefined,
                lastSortValues: lastSortValues ? JSON.parse(lastSortValues) : undefined,
                pageSize: pageSize ? Number(pageSize) : undefined,
                isAndroid: false
            })
        }).send(res);
    }
    CreateComment = async (req, res, next) => {
        const userId = req.userId
        const productId = req.params.productId
        const { content, rating, parentId, image_urls } = req.body
        console.log(req.body)
        new OkResponse({
            message: "create comment success",
            metadata: await CommentService.createComment({ userId, productId, content, rating, parentId, image_urls })
        }).send(res)
    }
    GetRootComment = async (req, res, next) => {
        const productId = req.params.productId
        const userId = req.userId
        const { cursor, limit } = req.query
        new OkResponse({
            message: "get comment success",
            metadata: await CommentService.getRootComments(productId, cursor, limit, userId)
        }).send(res)
    }
}

module.exports = new ProductController()