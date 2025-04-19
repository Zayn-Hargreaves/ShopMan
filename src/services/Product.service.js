const { NotFoundError } = require("../cores/error.response")
const productRepo = require("../models/repositories/product.repo")
const ProductRepository = require("../models/repositories/product.repo")
const wishlistRepo = require("../models/repositories/wishlist.repo")
const RedisService = require("./Redis.Service")
class ProductService {

    static async getProductDetail(slug, UserId = null) {
        if (!slug) throw new Error("Missing slug")
        const cacheKey = `product:slug:${slug}`
        let productDetail = await RedisService.getCachedData(cacheKey)

        if(!productDetail){
            productDetail = await ProductRepository.findProductBySlug(slug)
            if(!productDetail){
                await RedisService.cacheData(cacheKey, null, 300)
                throw new NotFoundError("product not found")
            }else{
                await RedisService.cacheData(cacheKey,productDetail, 3600)
            }
        }

        const viewZsetkey = "product:view:daily"
        await RedisService.upsertItemIntoZset(zsetkey, productDetail.id, 86400)

        const trendingZsetkey = 'product:trending:daily'
        const sale_count = productDetail.sale_count || 0
        const view_count = await RedisService.getZsetScore(viewZsetkey, `product:${productDetail.id}`) || 0
        const trendingScore = 0.6 * view_count + 0.4 * sale_count
        await RedisService.setTrendingScore(trendingZsetkey, productDetail.id, trendingScore, 86400)

        if (UserId !== null) {
            const ProductId = productDetail.id
            const WishlistItem = await wishlistRepo.checkProductInWishlist({ProductId, UserId})
            if (WishlistItem) {
                productDetail.isInWishlist = true
            }
            return productDetail
        }
        return productDetail
    }
    static async getDealOfTheDayProducts(){
        const cacheKey = 'deal:day'
        let products = await RedisService.getCachedData(cacheKey)
        if(!products){
            products = await ProductRepository.getDealOfTheDayProducts(10)
            if(!products){
                await RedisService.cacheData(cacheKey, null, 600)
            }else{
                await RedisService.cacheData(cacheKey, products,3600)
            }
        }
        return products
    }
    static async getAllDealProducts(page, offset){
        const cacheKey = `deal:page:${page}`
        let result = await RedisService.getCachedData(cacheKey)
        if(!result){
            result = await ProductRepository.getAllDealProducts(page, offset)
            await RedisService.cacheData(cacheKey, result, 3600)
        }
        return await ProductRepository.getAllDealProducts(page, size)
    }
    static async getTrendingProduct(limit = 10){
        const trendingZsetkey = "product:trending:daily"
        const cacheKey = `trending:limit:${limit}`

        let trendingProduct = await RedisService.getCachedData(cacheKey)
        if(!trendingProduct){
            const topTrending = await RedisService.getTrendingProduct(trendingZsetkey, limit)
            const productIds = topTrending
            .filter((_,index)=> index % 2  === 0)
            .map((id)=>id.replace('product:', ""))
            trendingProduct = await ProductRepository.findProductsByIds(productIds)

            await RedisService.cacheData(cacheKey, trendingProduct,3600)
        }
        return trendingProduct
    }
    static async getAllTrendingProducts(page= 1, size = 20){
        const trendingZsetKey = "product:trending:daily"
        const cacheKey = `trending:page:${page}:size:${size}`

        let result = await RedisService.getCachedData(cacheKey)
        if(result){
            return result
        }
        const start = (page -1) * size
        const end = start + size -1
        const productIds = await RedisService.getZsetRange(trendingZsetKey,start, end)
        if(!productIds || productIds.length === 0){
            return {
                totalItems:0,
                totalPages:0,
                currentPage:page,
                products:[],
            }
        }

        const cleanProductIds = productIds.map((id)=>{id.replace("product:","")})

        const products = await ProductRepository.findProductsByIds(cleanProductIds) 

        const totalItems = await RedisService.getZsetCount(trendingZsetKey)

        const totalPages = Math.ceil(totalItems/size)

        result = {
            totalItems,
            totalPages,
            currentPage:page,
            products
        }
        await RedisService.cacheData(cacheKey,result,3600)
        return result
    }

    static async getNewArrivals(page = 1,size = 20){
        return await ProductRepository.findNewArrivalsProduct(page,size)
    }
}

module.exports = ProductService