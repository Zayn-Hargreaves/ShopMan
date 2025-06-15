// CommentService.js
const { NotFoundError, BadRequestError } = require("../cores/error.response")
const repositoryFactory = require("../models/repositories/repositoryFactory.js")
const { Op } = require("sequelize")

class CommentService {
    static async createComment({ userId, productId, content, rating = null, parentId = null,image_urls= null }) {
        await repositoryFactory.initialize();
        const CommentRepo = repositoryFactory.getRepository("CommentRepository")
        const comment = await CommentRepo.createNestedComment({ userId, productId, content, rating, parentId,image_urls });
        const rawComment = (await CommentRepo.findCommentAndUser(comment.id)).toJSON()
        rawComment.isDeletable=true
        rawComment.isEditable=true
        return rawComment
    }

    static async getRootComments(productId, cursor , limit = 10, userId = null) {
        await repositoryFactory.initialize();
        const CommentRepo = repositoryFactory.getRepository("CommentRepository")
        return await CommentRepo.findRootComments(productId, cursor, limit, userId)
        
    }

    static async getReplies(parentCommentId, cursor, limit = 10, userId= null) {
        await repositoryFactory.initialize();
        const CommentRepo = repositoryFactory.getRepository("CommentRepository")
    
        return await CommentRepo.findReplies(parentCommentId, cursor,limit,userId);
    }

    static async updateComment(commentId, userId, content, image_urls, rating=null) {
        await repositoryFactory.initialize();
        const CommentRepo = repositoryFactory.getRepository("CommentRepository")
        const comment = await CommentRepo.findById(commentId);
        if (!comment) throw new NotFoundError("Comment not found");
        if (comment.UserId !== userId) throw new Error("Permission denied");
        const result = await CommentRepo.updateCommentContent(commentId, content,image_urls,rating);
        if(result != 1){
            throw new BadRequestError("Update comment failed")
        }
        const newComment = await CommentRepo.findCommentAndUser(commentId)
        const rawComment = newComment.toJSON()
        rawComment.isEditable= true
        rawComment.isDeletable= true
        return rawComment
    }

    static async deleteComment(commentId, userId) {
        await repositoryFactory.initialize();
        const CommentRepo = repositoryFactory.getRepository("CommentRepository")
        const comment = await CommentRepo.findById(commentId);
        if (!comment) throw new NotFoundError("Comment not found");
        if (comment.UserId !== userId) throw new Error("Permission denied");
        return await CommentRepo.deleteRecursive(comment);
    }
}

module.exports = CommentService;
