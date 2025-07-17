const complaintController = require('../../../controllers/admin/complaint.controller');
const { asyncHandler } = require('../../../helpers/asyncHandler');

const router = require('express').Router();

router.get('/:shopId/complaints', asyncHandler(complaintController.listComplaints));

module.exports = router;
