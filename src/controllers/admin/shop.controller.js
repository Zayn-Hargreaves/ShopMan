const ShopService = require("../../services/admin/Shop.Service.js")
const { OkResponse } = require("../../cores/success.response")

class ShopController {
    getMyShop = async (req, res, next) => {
        const userId = req.userId;
        const shopId = req.ShopId
        new OkResponse({
            message: "Get my shop success",
            metadata: await ShopService.getShopByUserId(userId,shopId)
        }).send(res);
    }
    registerShop = async (req, res, next) => {
        new OkResponse({
            message: "Register shop success",
            metadata: await ShopService.registerShop(req.body, req.userId)
        }).send(res);
    }
    updateShop = async (req, res, next) => {
        new OkResponse({
            message: "Update shop success",
            metadata: await ShopService.updateShop(req.ShopId, req.body)
        }).send(res);
    }
    getShop = async (req, res, next) => {
        new OkResponse({
            message: "Get shop success",
            metadata: await ShopService.getShopById(req.params.AdminShopId)
        }).send(res);
    }
    listShops = async (req, res, next) => {
        new OkResponse({
            message: "List shop success",
            metadata: await ShopService.listShops(req.query)
        }).send(res);
    }
    updateShopStatus = async (req, res, next) => {
        new OkResponse({
            message: "Update shop status success",
            metadata: await ShopService.updateStatus(req.params.AdminShopId, req.body.status)
        }).send(res);
    }
}

module.exports = new ShopController();
