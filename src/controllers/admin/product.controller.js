const ProductService = require("../../services/admin/Product.Service.js")
const { OkResponse } = require("../../cores/success.response")

class ProductController {
    listProducts = async (req, res, next) => {
        new OkResponse({
            message: "List products success",
            metadata: await ProductService.listProducts(req.params.AdminShopId, req.query)
        }).send(res);
    }
    
    addProduct = async (req, res, next) => {
        new OkResponse({
            message: "Add product success",
            metadata: await ProductService.addProduct(req.params.AdminShopId, req.body)
        }).send(res);
    }
    updateProduct = async (req, res, next) => {
        new OkResponse({
            message: "Update product success",
            metadata: await ProductService.updateProduct(req.params.AdminShopId, req.params.productId, req.body)
        }).send(res);
    }
    deleteProduct = async (req, res, next) => {
        new OkResponse({
            message: "Delete product success",
            metadata: await ProductService.deleteProduct(req.params.AdminShopId, req.params.productId)
        }).send(res);
    }
    getProductDetail = async(req,res,next)=>{
        new OkResponse({
            message:"get product details success",
            metadata:await ProductService.getProductDetailForShop(req.params.AdminShopId, req.params.ProductId)
        }).send(res)
    }
}

module.exports = new ProductController();
