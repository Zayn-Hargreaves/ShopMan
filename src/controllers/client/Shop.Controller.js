const { OkResponse } = require("../../cores/success.response")
const ElasticSearchService = require("../../services/client/elasticsearch/productES.service")
const ShopService = require("../../services/client/Shop.Service")
class ShopController {
    getShopDetails = async (req, res, next) => {
        const slug = req.params.slug
        const userId = req.userId
        new OkResponse({
            message: "get shop details sucess",
            metadata: await ShopService.getShopDetails(userId,slug)
        }).send(res)
    }
    getProductShop = async (req, res, next) => {
        const { slug } = req.params;
        const { minPrice, maxPrice, sortBy, lastSortValues, pageSize, isAndroid } = req.query;
        new OkResponse({
            message: "Get products by shop successfully",
            metadata: await ElasticSearchService.searchProducts({
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined,
                shopSlug: slug,
                sortBy: sortBy ? JSON.parse(sortBy) : undefined,
                lastSortValues: lastSortValues ? JSON.parse(lastSortValues) : undefined,
                pageSize: pageSize ? Number(pageSize) : undefined,
                isAndroid: isAndroid === 'true'
            })
        }).send(res);
    }
    getShopInfo = async(req, res, next)=>{
        const ShopId = req.params.ShopId
        const userId = req.userId
        new OkResponse({
            message: "get shop info success",
            metadata : await ShopService.getShopInfo(ShopId, userId)
        }).send(res)
    }
    FollowShop = async(req, res, next)=>{
        const ShopId = req.params.ShopId
        const userId = req.userId
        new OkResponse({
            message:"user follow shop successfull",
            metadata: await ShopService.followShop(userId,ShopId)
        }).send(res)
    }
    UnfollowShop = async(req, res, next)=>{
        const ShopId = req.params.ShopId
        const userId = req.userId
        new OkResponse({
            message:" user unfollow shop successfull",
            metadata: await ShopService.unfollowShop(userId,ShopId)
        }).send(res)
    }
}

module.exports = new ShopController()