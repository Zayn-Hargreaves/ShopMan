const ProductRepository = require("../models/repositories/product.repo")
class ProductService{
    static async getListProduct(){
        
        // khach hang lay product theo kieu phan trang youtube
    }
    static async getListProductByAdmin(){
        // shop lay produc theo cach phan trang binh thuong
    }
    static async createProductByAdmin(){
        // shop to
    }

    static async getProductDetail(slug){
        if(!slug) throw new Error("Missing slug")
        return await ProductRepository.findProductBySlug(slug)

    }
}