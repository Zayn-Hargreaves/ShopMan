const { OkResponse } = require("../../cores/success.response")
const ElasticSearchService = require("../../services/client/elasticsearch/productES.service")
const OrderService = require("../../services/client/order.service")

class OrderController {
    getListOrder = async (req, res, next) => {
        const userId = req.userId
        const {pageSize, lastSortValues} = req.query
        new OkResponse({
            message: "get list user order success",
            metadata: await ElasticSearchService.GetListOrderES({
                userId:userId,
                shopId:undefined,
                filters:undefined,
                sortBy:undefined,
                lastSortValues: lastSortValues ? JSON.parse(lastSortValues) : undefined,
                pageSize:pageSize ? Number(pageSize) : 20 ,
                isAdmin:'false'
            })
        }).send(res)
    }
    getOrderDetail = async (req, res, next) => {
        const userId = req.userId
        const orderId = req.params.id
        new OkResponse({
            message: "get order detail success",
            metadata: await OrderService.getOrderDetais(userId, orderId)
        }).send(res)
    }
    cancelOrder = async (req, res, next) => {
        const userId = req.userId
        const orderId = req.params.id
        new OkResponse({
            message: " cancel order detail success",
            metadata: await OrderService.cancelOrder(userId, orderId)
        }).send(res)
    }
}

module.exports = new OrderController()