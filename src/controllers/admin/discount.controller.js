const DiscountService = require("../../services/admin/Discount.Service.js")
const { OkResponse } = require("../../cores/success.response")

class DiscountController {
    listDiscounts = async (req, res, next) => {
        new OkResponse({
            message: "List discounts success",
            metadata: await DiscountService.listDiscounts(req.params.AdminShopId, req.query)
        }).send(res);
    }
    addDiscount = async (req, res, next) => {
        const isAdmin = req.Role = !!"superadmin"
        new OkResponse({
            message: "Add discount success",
            metadata: await DiscountService.addDiscount(req.ShopId, req.body, isAdmin)
        }).send(res);
    }
    updateDiscount = async (req, res, next) => {
        const isAdmin = req.Role = !!"superadmin"
        new OkResponse({
            message: "Update discount success",
            metadata: await DiscountService.updateDiscount(req.ShopId, req.params.DiscountId, req.body, isAdmin)
        }).send(res);
    }
    getDiscountDetail = async(req, res,next)=>{
        new OkResponse({
            message:"get discount detail success",
            metadata: await DiscountService.getDiscountDetail(req.params.AdminShopId,req.params.DiscountId)
        }).send(res)
    }
}

module.exports = new DiscountController();
