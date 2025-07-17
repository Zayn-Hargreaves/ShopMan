const AnalyticsService = require("../../services//admin/Analytics.Service.js")
const { OkResponse } = require("../../cores/success.response")

class AnalyticsController {
    getRevenue = async (req, res, next) => {
        const ShopId = req.Role =="superadmin" ? req.params.AdminShopId : req.ShopId
        new OkResponse({
            message: "Get revenue analytics success",
            metadata: await AnalyticsService.getRevenue(ShopId, req.query)
        }).send(res);
    }
    getOrderStatus = async (req, res, next) => {
        const ShopId = req.Role =="superadmin" ? req.params.AdminShopId : req.ShopId

        new OkResponse({
            message: "Get order status analytics success",
            metadata: await AnalyticsService.getOrderStatus(ShopId,req.query )
        }).send(res);
    }
    getTopProducts = async (req, res, next) => {
        const ShopId = req.Role =="superadmin" ? req.params.AdminShopId : req.ShopId
    
        new OkResponse({
            message: "Get top products analytics success",
            metadata: await AnalyticsService.getTopProduct(ShopId, req.query)
        }).send(res);
    }
}

module.exports = new AnalyticsController();
