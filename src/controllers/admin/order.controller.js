const OrderService = require("../../services/admin/Order.Service.js")
const { OkResponse } = require("../../cores/success.response")

class OrderController {
    listOrders = async (req, res, next) => {
        new OkResponse({
            message: "List orders success",
            metadata: await OrderService.listOrders(req.params.AdminShopId, req.query)
        }).send(res);
    }

    getOrder = async (req, res, next) => {
        new OkResponse({
            message: "Get order detail success",
            metadata: await OrderService.getOrder(req.params.AdminShopId, req.params.orderDetailId)
        }).send(res);
    }

    updateOrderStatus = async (req, res, next) => {
        new OkResponse({
            message: "Update order status success",
            metadata: await OrderService.updateOrderStatus(req.params.AdminShopId, req.params.orderDetailId, req.body.status)
        }).send(res);
    }

}

module.exports = new OrderController();
