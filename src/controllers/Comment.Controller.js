const { OkResponse } = require("../cores/success.response")
const CommentService = require("../services/Comment.service")

class CommentController {
    getCommentReply = async (req, res, next) => {
        const id = req.params.id
        const {page,limit} = req.query
        new OkResponse({
            message:"get replies comments",
            metadata: await CommentService.getReplies(id,page,limit)
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
        const newContent = req.body.content 
        new OkResponse({
            message:"update message success",
            metadata: await CommentService.updateComment(id,userId, newContent)
        }).send(res)
    }
}

module.exports = new CommentController()