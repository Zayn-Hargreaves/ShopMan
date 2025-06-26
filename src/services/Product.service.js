const { NotFoundError } = require("../cores/error.response")
const RedisService = require("./Redis.Service")
const RepositoryFactory = require("../models/repositories/repositoryFactory")
const { getInfoData } = require("../utils/index")
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
    static async getTrendingProductsByCursor(cursorScore = "+inf", limit = 10) {
        await RepositoryFactory.initialize();
        const ProductRepo = RepositoryFactory.getRepository("ProductRepository");
        const trendingZsetKey = "product:trending:daily";

        // Lấy từ ZSET: các phần tử có score < cursorScore, giảm dần
        const rawEntries = await RedisService.getZsetByScoreDescWithLimit(
            trendingZsetKey,
            cursorScore,
            limit
        ); // Phải viết thêm hàm này trong RedisService

        if (!rawEntries || rawEntries.length === 0) {
            return {
                products: [],
                nextCursor: null
            };
        }

        const productIds = [];
        const scores = [];

        for (let i = 0; i < rawEntries.length; i += 2) {
            const id = rawEntries[i].replace("product:", "");
            const score = parseFloat(rawEntries[i + 1]);
            productIds.push(id);
            scores.push(score);
        }

        const products = await ProductRepo.findProductByIds(productIds);

        return {
            products,
            nextCursor: scores.length > 0 ? scores[scores.length - 1] : null
        };
    }

    static async getDealOfTheDayProducts(cursor, limit, categoryId, minPrice, maxPrice, minRating, hasDiscount, minStock, sortBy) {
        const cacheKey = `deal:day:page:${cursor}:limit:${limit}:cat:${categoryId}:minP:${minPrice}:maxP:${maxPrice}:minR:${minRating}:hasD:${hasDiscount}:minS:${minStock}:sort:${sortBy}`;
        await RepositoryFactory.initialize();
        const ProductRepo = RepositoryFactory.getRepository('ProductRepository');
        let result = await RedisService.getCachedData(cacheKey);

        if (!result) {
            const data = await ProductRepo.getDealOfTheDayProducts(cursor, limit, categoryId, minPrice, maxPrice, minRating, hasDiscount, minStock, sortBy);
            const filteredResult = data.products
                .filter(product => {
                    const hasValidDiscount = product.discounts?.some(discount => discount.MaxUses > discount.UserCounts);
                    const meetsPrice = (!minPrice || product.price >= minPrice) && (!maxPrice || product.price <= maxPrice);
                    const meetsRating = !minRating || product.rating >= (minRating / 10); 
                    const meetsDiscount = !hasDiscount || (product.discounts && product.discounts.length > 0);
                    return hasValidDiscount && meetsPrice && meetsRating && meetsDiscount;
                })
                .map(product =>
                    getInfoData({
                        fields: ['id', 'name', 'price', 'slug', 'thumbnail', 'sale_count', 'rating', 'stock'],
                        object: product.toJSON()
                    })
                );
            data.products = filteredResult;
            data.totalItems = filteredResult.length;
            await RedisService.cacheData(cacheKey, data, filteredResult.length > 0 ? 600 : 300);
            return data;
        }
        return result;
    }
    static async getTrendingProduct(limit = 10) {
        await RepositoryFactory.initialize()
        const ProductRepo = RepositoryFactory.getRepository("ProductRepository")
        const trendingZsetkey = "product:trending:daily"
        const cacheKey = `trending:page:1:limit:${limit}`

        let trendingProduct = await RedisService.getCachedData(cacheKey)
        if (!trendingProduct) {
            const topTrending = await RedisService.getZsetRange(trendingZsetkey, 0, limit)
            const productIds = []
            for (let i = 0; i < topTrending.length; i += 2) {
                productIds.push(topTrending[i].replace("product:", ""))
            }
            trendingProduct = await ProductRepo.findProductByIds(productIds)

            await RedisService.cacheData(cacheKey, trendingProduct, 3600)
        }
        return trendingProduct
    }

    static async getNewArrivals(page = 1, limit = 10) {
        await RepositoryFactory.initialize()
        const ProductRepo = await RepositoryFactory.getRepository("ProductRepository")
        const cacheKey = `product:newArrivals:page:${page}:limit:${limit}`
        let result = await RedisService.getCachedData(cacheKey)
        if (result) {
            return result
        }
        result = await ProductRepo.findNewArrivalsProduct(page, limit)
        await RedisService.cacheData(cacheKey, result, 3600)
        return result
    }
}

module.exports = ProductService