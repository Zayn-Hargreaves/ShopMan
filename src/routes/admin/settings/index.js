const settingsController = require('../../../controllers/admin/settings.controller');
const { asyncHandler } = require('../../../helpers/asyncHandler');

const router = require('express').Router();

router.get('/:shopId/settings', asyncHandler(settingsController.getSettings));
router.post('/:shopId/settings', asyncHandler(settingsController.updateSettings));

module.exports = router;
