const ProductService = require("../services/Product.service")
class ProductController{
    getProductDetail = async(req, res, next)=>{
        const {productId} = req.params
        new OkResponse({
            message:"get product detail success",
            metadata: await ProductService.getProductDetail(productId)
        }).send(res)
    }
}

module.exports = new ProductController()