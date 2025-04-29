const { NotFoundError } = require("../cores/error.response")
const RedisService = require("./Redis.Service")
const RepositoryFactory = require("../models/repositories/repositoryFactory")
class ProductService {

    static async getProductDetail(slug, UserId = null) {
        await RepositoryFactory.initialize()
        const ProductRepo = RepositoryFactory.getRepository("ProductRepository")
        const wishlistRepo = RepositoryFactory.getRepository("WishListRepository")
        if (!slug) throw new Error("Missing slug")
        const cacheKey = `product:slug:${slug}`
        let productDetail = await RedisService.getCachedData(cacheKey)
        if (!productDetail) {
            productDetail = await ProductRepo.findProductBySlug(slug)
            if (!productDetail) {
                await RedisService.cacheData(cacheKey, productDetail, 300)
                throw new NotFoundError("product not found")
            } else {
                await RedisService.cacheData(cacheKey, productDetail, 3600)
            }
        }

        const viewZsetkey = "product:view:daily"
        await RedisService.upsertItemIntoZset(viewZsetkey, productDetail.id, 86400)

        const trendingZsetkey = 'product:trending:daily'
        const sale_count = productDetail.sale_count || 0
        const view_count = await RedisService.getZsetScore(viewZsetkey, `product:${productDetail.id}`) || 0
        const trendingScore = 0.6 * view_count + 0.4 * sale_count
        await RedisService.setTrendingScore(trendingZsetkey, productDetail.id, trendingScore, 86400)

        if (UserId !== null) {
            const ProductId = productDetail.id
            const WishlistItem = await wishlistRepo.checkProductInWishlist({ ProductId, UserId })
            if (WishlistItem) {
                productDetail.isInWishlist = true
            }
            return productDetail
        }
        return productDetail
    }
    static async getDealOfTheDayProducts(page, limit) {
        const cacheKey = `deal:day:page:${page}:limit:${limit}`
        await RepositoryFactory.initialize()
        const ProductRepo = RepositoryFactory.getRepository('ProductRepository')
        let result = await RedisService.getCachedData(cacheKey)
        let filteredResult
        if (!result) {
            const data = await ProductRepo.getDealOfTheDayProducts(page, limit);
            filteredResult = data.products.filter(product => {
                if (!product.discounts || product.discounts.length === 0) return false;
                return product.discounts.some(discount => discount.MaxUses > discount.UserCounts);
            });
            data.products = filteredResult
            data.totalItems = filteredResult.length
            data.totalPages = Math.ceil(filteredResult.length / limit);
            if (filteredResult.length == 0 || !filteredResult) {
                await RedisService.cacheData(cacheKey, data, 600)
                return data
            } else {
                await RedisService.cacheData(cacheKey, data, 3600)
                return data
            }
        }
        return result
    }
    static async getAllDealProducts(page, limit) {
        const cacheKey = `deal:page:${page}`
        await RepositoryFactory.initialize()
        const ProductRepo = RepositoryFactory.getRepository("ProductRepository")
        let result = await RedisService.getCachedData(cacheKey)

        if (!result) {
            result = await ProductRepo.getAllDealProducts(page, limit)
            await RedisService.cacheData(cacheKey, result, 3600)
        }
        return result
    }
    static async getTrendingProduct(limit = 10) {
        await RepositoryFactory.initialize()
        const ProductRepo = RepositoryFactory.getRepository("ProductRepository")
        const trendingZsetkey = "product:trending:daily"
        const cacheKey = `trending:page:1:limit:${limit}`

        let trendingProduct = await RedisService.getCachedData(cacheKey)
        if (!trendingProduct) {
            const topTrending = await RedisService.getZsetRange(trendingZsetkey, 0, limit)
            console.log("topTrending::",topTrending)
            const productIds = topTrending
                .map((id) => id.replace('product:', ""))
            trendingProduct = await ProductRepo.findProductByIds(productIds)

            await RedisService.cacheData(cacheKey, trendingProduct, 3600)
        }
        return trendingProduct
    }
    static async getAllTrendingProducts(page = 1, limit = 10) {
        await RepositoryFactory.initialize()
        const ProductRepo = RepositoryFactory.getRepository("ProductRepository")
        const trendingZsetKey = "product:trending:daily";
        const cacheKey = `trending:page:${page}:limit:${limit}`;

        let result = await RedisService.getCachedData(cacheKey);
        if (result) {
            return result;
        }

        const start = (page - 1) * limit;
        const end = start + limit - 1;

        const productIds = await RedisService.getZsetRange(trendingZsetKey, start, end);

        if (!productIds || productIds.length === 0) {
            return {
                totalItems: 0,
                totalPages: 0,
                currentPage: page,
                products: [],
            };
        }

        const cleanProductIds = productIds.map(id => id.replace("product:", ""));

        const products = await ProductRepo.findProductByIds(cleanProductIds);

        const totalItems = await RedisService.getZsetCount(trendingZsetKey);
        const totalPages = Math.ceil(totalItems / limit);

        result = {
            totalItems:totalItems + 1,
            totalPages:totalPages,
            currentPage: page,
            products:products,
        };

        await RedisService.cacheData(cacheKey, result, 3600); 
        return result;
    }


    static async getNewArrivals(page = 1, limit = 10) {
        await RepositoryFactory.initialize()
        const ProductRepo = await RepositoryFactory.getRepository("ProductRepository")
        const cacheKey = `product:newArrivals:page:${page}:limit:${limit}`
        let result = await RedisService.getCachedData(cacheKey)
        if(result){
            return result
        }
        result =  await ProductRepo.findNewArrivalsProduct(page, limit)
        await RedisService.cacheData(cacheKey,result, 3600)
        return result
    }
}

module.exports = ProductService