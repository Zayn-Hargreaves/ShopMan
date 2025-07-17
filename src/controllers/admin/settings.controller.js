const SettingsService = require("../services/Settings.Service.js")
const { OkResponse } = require("../cores/success.response")

class SettingsController {
    getSettings = async (req, res, next) => {
        new OkResponse({
            message: "Get settings success",
            metadata: await SettingsService.getSettings(req.params.shopId)
        }).send(res);
    }
    updateSettings = async (req, res, next) => {
        new OkResponse({
            message: "Update settings success",
            metadata: await SettingsService.updateSettings(req.params.shopId, req.body)
        }).send(res);
    }
}

module.exports = new SettingsController();
