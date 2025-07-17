const router = require("express").Router()
const {asyncHandler} = require("../../../helpers/asyncHandler")
const {authentication, optionalAuthentication} = require("../../../auth/authUtils")
const CommentController = require("../../../controllers/client/Comment.Controller")


router.get("/:id/replies", optionalAuthentication,asyncHandler(CommentController.getCommentReply))
router.delete("/:id", authentication,asyncHandler(CommentController.deleteCommentByUser))
router.put("/:id", authentication, asyncHandler(CommentController.updateCommentByUser))

module.exports = router
