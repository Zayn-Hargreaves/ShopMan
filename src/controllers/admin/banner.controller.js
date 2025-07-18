const BannerService = require("../../services/admin/banner.service.js")
const { OkResponse } = require("../../cores/success.response")

class BannerController {

    listBanners = async (req, res, next) => {
        new OkResponse({
            message: "List banners success",
            metadata: await BannerService.listBanners(req.params.AdminShopId, req.query)
        }).send(res);
    }


    addBanner = async (req, res, next) => {
        try {
            const isAdmin = req.Role = !!"superadmin"

            new OkResponse({
                message: "Add banner success",
                metadata: await BannerService.addBanner(req.ShopId, req.body, isAdmin)
            }).send(res);
        } catch (err) {
            next(err);
        }
    }


    updateBanner = async (req, res, next) => {
        try {
            const isAdmin = req.Role = !!"superadmin"
            new OkResponse({
                message: "Update banner success",
                metadata: await BannerService.updateBanner(req.ShopId, req.params.bannerId, req.body, isAdmin)
            }).send(res);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new BannerController();
