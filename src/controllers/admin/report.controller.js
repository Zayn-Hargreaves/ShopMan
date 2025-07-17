
const ReportService = require("../services/Report.Service.js")
const { OkResponse } = require("../cores/success.response")

class ReportController {
    listReports = async (req, res, next) => {
        new OkResponse({
            message: "List reports success",
            metadata: await ReportService.listReports(req.params.shopId, req.query)
        }).send(res);
    }
    // Thêm các hàm report khác nếu có
}

module.exports = new ReportController();
