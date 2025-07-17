const { OkResponse } = require("../../cores/success.response")
const NotfiticationService = require("../../services//client/Notification.service")

class NotificationController{
    getAllNotification = async(req , res , next)=>{
        const userId =req.userId
        const {cursor, limit} = req.query
        new OkResponse({
            message:"get notifications success",
            metadata: await NotfiticationService.getAllNotification(userId,cursor,limit)
        }).send(res)
    }
    updateNotification = async(req, res, next)=>{
        const userId = req.userId
        const id = req.params.id
        new OkResponse({
            message:"update notification success",
            metadata:await NotfiticationService.updateNotification(id, userId)
        }).send(res)
    }
}

module.exports = new NotificationController()