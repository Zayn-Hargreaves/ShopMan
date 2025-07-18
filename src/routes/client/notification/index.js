const NotificationController = require("../../../controllers/client/Notification.Controller")
const { asyncHandler } = require("../../../helpers/asyncHandler")

const router = require("express").Router()
/**
 * @swagger
 * /api/v1/notification:
 *   get:
 *     summary: Get all notifications
 *     description: Returns all notifications of the authenticated user with cursor-based pagination
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Cursor for pagination (ISO date-time format)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of notifications to return
 *     responses:
 *       200:
 *         description: Get notifications success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: get notifications success
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     totalItem:
 *                       type: integer
 *                       example: 100
 *                     notifications:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           type:
 *                             type: string
 *                             example: order
 *                           option:
 *                             type: string
 *                             example: success
 *                           content:
 *                             type: string
 *                             example: "Đơn hàng ABC123 đã được giao thành công"
 *                           isRead:
 *                             type: boolean
 *                             example: false
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           meta:
 *                             type: object
 *                             example: { orderId: 123 }
 *                     nextCursor:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-07-17T15:35:12.000Z"
 *       401:
 *         description: Unauthorized
 */

router.get("/", asyncHandler(NotificationController.getAllNotification))
/**
 * @swagger
 * /api/v1/notification/{id}/read:
 *   patch:
 *     summary: Mark notification as read
 *     description: Marks a specific notification as read for the authenticated user
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Notification ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Update notification success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: update notification success
 *                 metadata:
 *                   type: object
 *                   example:
 *                     [1]
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notification not found
 */

router.patch("/:id/read", asyncHandler(NotificationController.updateNotification))

module.exports = router