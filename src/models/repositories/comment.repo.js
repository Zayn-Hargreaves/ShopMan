const { includes } = require("lodash");
const { Op, where } = require("sequelize");
const { getSelectData } = require("../../utils");
const { NotFoundError } = require("../../cores/error.response");
class CommentRepository {
    constructor(models) {
        this.Comment = models.Comment;
        this.Product = models.Products
        this.User = models.User
    }

    async findById(commentId) {
        return await this.Comment.findByPk(commentId);
    }
    async findCommentAndUser(commentId){
        return await this.Comment.findByPk(commentId,{
            include: {
                model: this.User,
                attributes: getSelectData(['id', 'name', 'avatar']),
                as: 'user'
            },
            attributes: getSelectData(['id', 'UserId', 'content', 'rating', 'createdAt', 'left', 'right', 'ParentId', 'image_urls'])
        })
    }

    async createNestedComment({ userId, productId, content, rating, parentId, image_urls }) {
        return await this.Comment.sequelize.transaction(async (t) => {
            let left, right;
            if (!parentId) {
                const maxRight = await this.Comment.max("right", {
                    where: { ProductId: productId },
                    transaction: t
                }) || 0;

                left = maxRight + 1;
                right = maxRight + 2;
            } else {
                const parent = await this.Comment.findByPk(parentId, { transaction: t });
                if (!parent) throw new NotFoundError("Parent comment not found");

                await this.Comment.update(
                    { right: this.Comment.sequelize.literal('"right" + 2') },
                    {
                        where: {
                            right: { [Op.gte]: parent.right },
                            ProductId: productId
                        },
                        transaction: t
                    }
                );

                await this.Comment.update(
                    { left: this.Comment.sequelize.literal('"left" + 2') },
                    {
                        where: {
                            left: { [Op.gt]: parent.right },
                            ProductId: productId
                        },
                        transaction: t
                    }
                );

                left = parent.right;
                right = parent.right + 1;
            }

            const newComment = await this.Comment.create({
                UserId: userId,
                ProductId: productId,
                ParentId: parentId,
                image_urls: image_urls,
                content,
                rating,
                left,
                right
            }, { transaction: t });

            if (!parentId && rating !== null) {
                const avgResult = await this.Comment.findOne({
                    attributes: [[this.Comment.sequelize.fn('AVG', this.Comment.sequelize.col('rating')), 'avgRating']],
                    where: {
                        ProductId: productId,
                        ParentId: null,
                        rating: { [Op.ne]: null }
                    },
                    raw: true,
                    transaction: t
                });

                const avgRating = parseFloat(avgResult.avgRating || 0).toFixed(2);

                await this.Product.update(
                    { rating: avgRating },
                    { where: { id: productId }, transaction: t }
                );
            }
            

            return newComment
        });
    }


    async findRootComments(productId, cursor, limit, userId) {
        const whereClause = { ProductId: productId, ParentId: null }
        if (cursor) {
            const cursorDate = new Date(cursor)
            whereClause.createdAt = { [Op.lte]: cursorDate }
        }
        const comments = await this.Comment.findAll({
            where: whereClause,
            include: {
                model: this.User,
                attributes: getSelectData(['id', 'name', 'avatar']),
                as: 'user'
            },
            limit: limit + 1,
            order: [['createdAt', 'DESC'], ['id', "DESC"]],
            attributes: getSelectData(['id', 'UserId', 'content', 'rating', 'createdAt', 'left', 'right', 'ParentId', 'image_urls'])
        })
        const hasMore = comments.length > limit;
        if (hasMore) comments.pop();
        const resultComments = comments.map(comment => {
            const isOwner = userId !== null && comment.UserId === userId
            const isEditable = isOwner
            const isDeletable = isOwner
            return {
                ...comment.toJSON(),
                isEditable,
                isDeletable
            }
        })
        const result = {
            totalItems: await this.Comment.count({ where: { ProductId: productId, ParentId: null } }),
            comments: resultComments,
            nextCursor: hasMore ? comments[comments.length - 1].createdAt : null
        };
        return result
    }

    async findReplies(parentId, cursor, limit, userId) {
        const parent = await this.Comment.findByPk(parentId)
        if (!parent) {
            throw NotFoundError("Comment not found")
        }
        const whereClause = {
            left: { [Op.between]: [parent.left+1, parent.right-1] },
            right: { [Op.between]: [parent.left+1, parent.right-1] }
        };
        if (cursor) {
            const cursorDate = new Date(cursor);
            whereClause.createdAt = { [Op.lt]: cursorDate };
        }
        const replies = await this.Comment.findAll({
            where: whereClause,
            include: {
                model: this.User,
                attributes: getSelectData(['id', 'name', 'avatar']),
                as: "user"
            },
            order: [['left', 'ASC'], ['id', 'DESC']],
            limit: limit + 1,
            attributes: getSelectData(['id', 'UserId', 'content', 'rating', 'createdAt', 'left', 'right', 'ParentId','image_urls'])
        });
        const hasMore = replies.length > limit;
        if (hasMore) replies.pop();

        const resultReplies = replies.map(reply => {
            const isOwner = userId !== null && reply.UserId === userId;
            const isEditable = isOwner
            const isDeletable = isOwner;

            return {
                ...reply.toJSON(),
                isEditable,
                isDeletable
            };
        });

        const result = {
            totalItems: await this.Comment.count({ where: whereClause }),
            comments: resultReplies,
            nextCursor: hasMore ? replies[replies.length - 1].createdAt : null
        };
        return result
    }

    async updateCommentContent(commentId, newContent, image_urls, rating) {

        return await this.Comment.update(
            {
                content: newContent,
                image_urls: image_urls,
            },
            { where: { id: commentId } }
        );
    }

    async deleteRecursive(comment) {
        const { left, right, ProductId } = comment;
        return await this.Comment.destroy({
            where: {
                left: { [Op.gte]: left },
                right: { [Op.lte]: right },
                ProductId
            }
        });
    }
}

module.exports = CommentRepository;