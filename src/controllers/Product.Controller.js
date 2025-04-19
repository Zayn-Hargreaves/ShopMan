const { OkResponse } = require("../cores/success.response")
const ProductService = require("../services/Product.service")
class ProductController{
    getProductDetail = async(req, res, next)=>{
        const {slug} = req.params
        const {userId}= req.userId
        new OkResponse({
            message:"get product detail success",
            metadata: await ProductService.getProductDetail(slug, userId)
        }).send(res)
    }
    getTrendingProducts = async(req,res, next)=>{
        new OkResponse({
            message:"get trending products success",
            metadata: await ProductService.getTrendingProduct()
        }).send(res)
    }
    getAllTrendingProducts = async(req, res,next)=>{
        const {page, pageSize} = req.body
        new OkResponse({
            message:"get all trending product sucess",
            metadata : await ProductService.getAllTrendingProducts(page,pageSize)
        }).send(res)
    }
    getDealOfTheDay = async(req,res, next)=>{
        new OkResponse({
            message:"get deal of the day success",
            metadata: await ProductService.getDealOfTheDayProducts()
        }).send(res)
    }
    getAllDealProduct = async(req,res, next)=>{
        const {page, pageSize} = req.query
        new OkResponse({
            message:'get all deal product success',
            metadata:await ProductService.getAllDealProducts(page, pageSize)
        })
    }

    getNewArrivals = async(req,res, next)=>{
        const {page,pageSize} = req.query
        new OkResponse({
            message:"get new arrivals success",
            metadata: await ProductService.getNewArrivals(page,pageSize)
        }).send(res)
    }
}

module.exports = new ProductController()