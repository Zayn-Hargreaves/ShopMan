const { OkResponse } = require("../../cores/success.response")
const CommentService = require("../../services/client/Comment.service")

class CommentController {
    getCommentReply = async (req, res, next) => {
        const id = req.params.id
        const userId = req.userId
        const {cursor, limit} = req.query
        new OkResponse({
            message:"get replies comments",
            metadata: await CommentService.getReplies(id,cursor,limit,userId)
        }).send(res)
    }
    deleteCommentByUser = async(req, res, next)=>{
        const id = req.params.id
        const userId = req.userId
        new OkResponse({
            message: " delete message success",
            metadata: await CommentService.deleteComment(id, userId)
        }).send(res)
    }
    updateCommentByUser = async(req, res, next)=>{
        const id = req.params.id
        const userId = req.userId
        const {content, image_urls, rating} = req.body
        new OkResponse({
            message:"update message success",
            metadata: await CommentService.updateComment(id,userId, content,image_urls)
        }).send(res)
    }
}

module.exports = new CommentController()