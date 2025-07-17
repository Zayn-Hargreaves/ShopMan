const reportController = require('../../../controllers/admin/report.controller');
const { asyncHandler } = require('../../../helpers/asyncHandler');

const router = require('express').Router();

router.get('/:shopId/reports', asyncHandler(reportController.listReports) );

module.exports = router;
