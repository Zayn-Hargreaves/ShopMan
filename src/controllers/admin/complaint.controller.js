const ComplaintService = require("../services/Complaint.Service.js")
const { OkResponse } = require("../cores/success.response")

class ComplaintController {
    listComplaints = async (req, res, next) => {
        new OkResponse({
            message: "List complaints success",
            metadata: await ComplaintService.listComplaints(req.params.shopId, req.query)
        }).send(res);
    }
}

module.exports = new ComplaintController();
