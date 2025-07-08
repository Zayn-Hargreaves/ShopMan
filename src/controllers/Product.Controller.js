const { OkResponse } = require("../cores/success.response");
const CommentService = require("../services/Comment.service");
const ProductService = require("../services/Product.service")
const CartService = require("../services/Cart.service")
const ElasticSearchService = require("../services/elasticsearch/productES.service")
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

        console.log("controller:", lastSortValues)
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
        const { minPrice, maxPrice, lastSortValues, pageSize,isAndroid } = req.query;
        const sortBy = { field: 'createdAt', order: 'desc' };
        new OkResponse({
            message: "Get new arrval products successfully",
            metadata: await ElasticSearchService.searchProducts({
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined,
                sortBy, // truyền object
                lastSortValues: lastSortValues ? JSON.parse(lastSortValues) : undefined,
                pageSize: pageSize ? Number(pageSize) : 10,
                isAndroid: isAndroid === 'true'
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
    getProductSkus = async(req, res, next)=>{
        const productId = req.params.productId
        new OkResponse({
            message:"get produt sku success",
            metadata: await ProductService.getProductSkus(productId)
        }).send(res)
    }
     getDiscountOfProduct = async(req, res, next)=>{
        const ProductId = req.params.ProductId
        new OkResponse({
            message:"get Product discount success",
            metadata:await CartService.getDiscountOfProduct(ProductId)
        }).send(res)
    }
}

module.exports = new ProductController()