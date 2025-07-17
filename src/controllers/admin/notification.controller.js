const NotificationService = require("../../services//admin/Notification.Service.js")
const { OkResponse } = require("../../cores/success.response")

class NotificationController {
    listNotifications = async (req, res, next) => {
        new OkResponse({
            message: "List notifications success",
            metadata: await NotificationService.listNotifications(req.params.shopId, req.query)
        }).send(res);
    }
}

module.exports = new NotificationController();
