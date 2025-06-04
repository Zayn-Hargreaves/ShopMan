const { Op } = require("sequelize")
class CommentRepository {
    constructor(models) {
        this.Comment = models.Comment;
    }

    async findById(commentId) {
        return await this.Comment.findByPk(commentId);
    }

    async createNestedComment({ userId, productId, content, rating, ParentId }) {
        return await this.Comment.sequelize.transaction(async (t) => {
            let left, right;

            if (!ParentId) {
                const maxRight = await this.Comment.max("right", {
                    where: { ProductId: productId },
                    transaction: t
                }) || 0;

                left = maxRight + 1;
                right = maxRight + 2;
            } else {
                const parent = await this.Comment.findByPk(ParentId, { transaction: t });
                if (!parent) throw new Error("Parent comment not found");

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

            return await this.Comment.create({
                UserId: userId,
                ProductId: productId,
                ParentId,
                content,
                rating,
                left,
                right
            }, { transaction: t });
        });
    }


    async findRootComments(productId, page, limit) {
        const offset = (page - 1) * limit;
        const { count, rows } = await this.Comment.findAndCountAll({
            where: { ProductId: productId, ParentId: null },
            order: [['left', 'ASC']],
            limit,
            offset
        });
        return {
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            comments: rows
        }
    }

    async findReplies(parentId, limit) {
        return await this.Comment.findAll({
            where: { ParentId: parentId },
            order: [['left', 'ASC']],
            limit
        });
    }

    async updateCommentContent(commentId, newContent) {
        return await this.Comment.update(
            { content: newContent },
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