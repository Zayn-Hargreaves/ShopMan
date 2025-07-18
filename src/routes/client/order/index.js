const OrderController = require("../../../controllers/client/Order.Controller")
const { asyncHandler } = require("../../../helpers/asyncHandler")

const router = require("express").Router()
/**
 * @swagger
 * /api/v1/order:
 *   get:
 *     summary: Get list of user orders
 *     description: Returns a paginated list of user orders using ElasticSearch
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           example: 20
 *         description: Number of items per page
 *       - in: query
 *         name: lastSortValues
 *         schema:
 *           type: string
 *           example: '{"createdAt": "2024-07-01T12:00:00.000Z"}'
 *         description: Last sort values for cursor pagination
 *     responses:
 *       200:
 *         description: Get user order list success
 *         content:
 *           application/json:
 *             example:
 *               message: "get list user order success"
 *               status: 200
 *               metadata:
 *                 orders: [...]
 *       401:
 *         description: Unauthorized
 */

router.get("/", asyncHandler(OrderController.getListOrder))
/**
 * @swagger
 * /api/v1/order/details/{id}:
 *   get:
 *     summary: Get order details
 *     description: Returns the detail of a specific order by ID
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the order
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Get order detail success
 *         content:
 *           application/json:
 *             example:
 *               message: "get order detail success"
 *               status: 200
 *               metadata:
 *                 orderId: 123
 *                 items: [...]
 *                 shippingInfo: {...}
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */

router.get("/details/:id", asyncHandler(OrderController.getOrderDetail))
/**
 * @swagger
 * /api/v1/order/cancel/{id}:
 *   patch:
 *     summary: Cancel user order
 *     description: Cancel a specific order if eligible. Also restores stock and refund if applicable.
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the order to cancel
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cancel order success
 *         content:
 *           application/json:
 *             example:
 *               message: "cancel order detail success"
 *               status: 200
 *               metadata:
 *                 cancelled: true
 *                 orderId: 123
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found or not cancellable
 */

router.patch("/cancel/:id", asyncHandler(OrderController.cancelOrder))
module.exports = router