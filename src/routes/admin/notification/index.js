const { checkPermission } = require('../../../auth/authUtils');
const notificationController = require('../../../controllers/admin/notification.controller');
const { asyncHandler } = require('../../../helpers/asyncHandler');

const router = require('express').Router();

router.get('/:shopId/notifications',asyncHandler(notificationController.listNotifications));

module.exports = router;
