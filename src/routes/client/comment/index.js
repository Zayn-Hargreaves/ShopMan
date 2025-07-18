const router = require("express").Router()
const {asyncHandler} = require("../../../helpers/asyncHandler")
const {authentication, optionalAuthentication} = require("../../../auth/authUtils")
const CommentController = require("../../../controllers/client/Comment.Controller")

/**
 * @swagger
 * /api/v1/comments/{id}/replies:
 *   get:
 *     summary: Get replies to a comment
 *     description: Returns a list of replies for a specific comment
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the parent comment
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: Cursor for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of replies to return
 *     responses:
 *       200:
 *         description: Replies retrieved successfully
 */

/**
 * @swagger
 * /api/v1/comments/{id}:
 *   delete:
 *     summary: Delete a comment by user
 *     description: Allows an authenticated user to delete their comment
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Comment not found
 */

/**
 * @swagger
 * /api/v1/comments/{id}:
 *   put:
 *     summary: Update a comment by user
 *     description: Allows an authenticated user to update their comment
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               image_urls:
 *                 type: array
 *                 items:
 *                   type: string
 *               rating:
 *                 type: number
 *             required:
 *               - content
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Comment not found
 */


router.get("/:id/replies", optionalAuthentication,asyncHandler(CommentController.getCommentReply))
router.delete("/:id", authentication,asyncHandler(CommentController.deleteCommentByUser))
router.put("/:id", authentication, asyncHandler(CommentController.updateCommentByUser))

module.exports = router
