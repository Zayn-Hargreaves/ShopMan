const NotificationController = require("../../../controllers/Notification.Controller")
const { asyncHandler } = require("../../../helpers/asyncHandler")

const router = require("express").Router()

router.get("/", asyncHandler(NotificationController.getAllNotification))
router.patch("/:id/read", asyncHandler(NotificationController.updateNotification))

module.exports = router