const AnalyticsRepository = require("../../db/edb/repositories/analysticsRepository");

class AnalyticsService{
    static async getRevenue(ShopId,query){
        return await AnalyticsRepository.getRevenue(ShopId,query)
    }

    static async getOrderStatus(ShopId,query){
        return await AnalyticsRepository.getOrderStatus(ShopId,query)
    }

    static async getTopProduct(ShopId, query){
        return await AnalyticsRepository.getTopProduct(ShopId,query)
    }
}


module.exports = AnalyticsService


