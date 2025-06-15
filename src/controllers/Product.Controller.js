const { OkResponse } = require("../cores/success.response");
const CommentService = require("../services/Comment.service");
const ProductService = require("../services/Product.service")
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
        const { page, limit } = req.query
        new OkResponse({
            message: "get deal of the day success",
            metadata: await ProductService.getDealOfTheDayProducts(parseInt(page), parseInt(limit))
        }).send(res)
    }
    getAllDealProduct = async (req, res, next) => {
        const { page, limit } = req.query
        new OkResponse({
            message: 'get all deal product success',
            metadata: await ProductService.getAllDealProducts(parseInt(page), parseInt(limit))
        }).send(res)
    }
    getTrendingProducts = async (req, res, next) => {
        new OkResponse({
            message: "get trending products success",
            metadata: await ProductService.getTrendingProduct()
        }).send(res)
    }
    getAllTrendingProducts = async (req, res, next) => {
        const { cursorScore = "+inf", limit = 10 } = req.query;
        new OkResponse({
            message: "get trending products by cursor success",
            metadata: await ProductService.getTrendingProductsByCursor(cursorScore, parseInt(limit)),
        }).send(res);
    }

    getNewArrivals = async (req, res, next) => {
        const { page, limit } = req.query
        new OkResponse({
            message: "get new arrivals success",
            metadata: await ProductService.getNewArrivals(parseInt(page), parseInt(limit))
        }).send(res)
    }
    CreateComment = async(req,res,next)=>{
        const userId = req.userId
        const productId = req.params.productId
        const {content, rating, parentId,image_urls} = req.body
        new OkResponse({
            message:"create comment success",
            metadata:await CommentService.createComment({userId,productId, content, rating, parentId,image_urls})
        }).send(res)
    }
    GetRootComment = async(req, res, next)=>{
        const productId = req.params.productId
        const userId = req.userId
        const {cursor, limit} = req.query
        new OkResponse({
            message:"get comment success",
            metadata: await CommentService.getRootComments(productId,cursor, limit,userId)
        }).send(res)
    }
}

module.exports = new ProductController()