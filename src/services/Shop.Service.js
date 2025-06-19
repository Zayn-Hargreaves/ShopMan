const { NotFoundError } = require("../cores/error.response")
const { getInfoData } = require("../utils")
const ShopRepo = require("../models/repositories/shop.repo.js")
const repositoryFactory = require("../models/repositories/repositoryFactory.js")
const RedisService = require("./Redis.Service.js")
class ShopService {
    static async getShopDetails(userId,slug) {
        await repositoryFactory.initialize()
        const ShopRepo = repositoryFactory.getRepository("ShopRepository")
        const shop = await ShopRepo.findShopBySlug(slug)
        if (!shop) {
            throw new NotFoundError("Shop is not found")
        }
        let isFollowing = false
        try {
            const result = await RedisService.isMemberOfSet(`user:follow:${userId}`, `${ShopId}`);
            isFollowing = result === 1
        } catch (error) {
            console.warn(`[Redis] Failed to check follow status, fallback to DB::${error}`,);
            const FollowRepo = repositoryFactory.getRepository("FollowRepository");
            if(userId){
                isFollowing = await FollowRepo.CheckUserFollow(userId, ShopId);
            }
        }
        return {
            shop: getInfoData({
                fields: ['id', 'name', 'desc', 'slug', 'logo','thumb', 'shopLocation', 'rating', 'slug'],
                object: shop
            }),
            discount: shop.discounts,
            isFollowing
        }
    }
    static async getShopInfo(ShopId, userId) {
        await repositoryFactory.initialize()
        const ShopRepo = repositoryFactory.getRepository("ShopRepository")
        const shop = await ShopRepo.findShopByPk(ShopId)

        if (!shop) {
            throw NotFoundError("Shop not found")
        }
        let isFollowing = false
        try {
            const result = await RedisService.isMemberOfSet(`user:follow:${userId}`, `${ShopId}`);
            isFollowing = result === 1
        } catch (error) {
            console.warn(`[Redis] Failed to check follow status, fallback to DB::${error}`,);
            const FollowRepo = repositoryFactory.getRepository("FollowRepository");
            if(userId){
                isFollowing = await FollowRepo.CheckUserFollow(userId, ShopId);
            }
        }
        return {
            shop: getInfoData({
                fields: ['id', 'name', 'slug', 'status', 'logo','thumb', 'desc', 'rating'],
                object: shop
            }),
            isFollowing
        }
    }
    static async followShop(userId, shopId) {
        await repositoryFactory.initialize();
        const ShopRepo = repositoryFactory.getRepository("ShopRepository");
        const FollowRepo = repositoryFactory.getRepository("FollowRepository");

        const shop = await ShopRepo.findShopByPk(shopId);
        if (!shop) throw new NotFoundError("Shop not found");

        const already = await RedisService.isMemberOfSet(`user:follow:${userId}`, `${shopId}`);

        if (already === 1) return { success: true, message: "Already followed" };

        await FollowRepo.createFollow(userId, shopId);

        const tmp1=await RedisService.addToSet(`user:follow:${userId}`, `${shopId}`);
        const tmp2= await RedisService.addToSet(`shop:followers:${shopId}`, `${userId}`);
        console.log(tmp1,tmp2)
        return { success: true, message: "Followed successfully" };
    }

    static async unfollowShop(userId, shopId) {
        await repositoryFactory.initialize();
        const ShopRepo = repositoryFactory.getRepository("ShopRepository");
        const FollowRepo = repositoryFactory.getRepository("FollowRepository");

        const shop = await ShopRepo.findShopByPk(shopId);
        if (!shop) throw new NotFoundError("Shop not found");

        const already = await RedisService.isMemberOfSet(`user:follow:${userId}`, `${shopId}`);
        if (already === 0) return { success: true, message: "Not following" };

        await FollowRepo.deleteFollow(userId, shopId);

        await RedisService.removeFromSet(`user:follow:${userId}`, `${shopId}`);
        await RedisService.removeFromSet(`shop:followers:${shopId}`, `${userId}`);

        return { success: true, message: "Unfollowed successfully" };
    }
}

module.exports = ShopService