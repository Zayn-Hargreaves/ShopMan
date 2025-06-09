// CommentService.js
const { NotFoundError } = require("../cores/error.response")
const repositoryFactory = require("../models/repositories/repositoryFactory.js")
const { Op } = require("sequelize")

class CommentService {
    static async createComment({ userId, productId, content, rating = null, ParentId = null }) {
        await repositoryFactory.initialize();
        const CommentRepo = repositoryFactory.getRepository("CommentRepository")

        return await CommentRepo.createNestedComment({ userId, productId, content, rating, ParentId });
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

    static async updateComment(commentId, userId, newContent) {
        await repositoryFactory.initialize();
        const CommentRepo = repositoryFactory.getRepository("CommentRepository")
        const comment = await CommentRepo.findById(commentId);
        if (!comment) throw new NotFoundError("Comment not found");
        if (comment.UserId !== userId) throw new Error("Permission denied");
        return await CommentRepo.updateCommentContent(commentId, newContent);
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
