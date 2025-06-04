const { where } = require("sequelize")

class FollowRepository {
    constructor(models) {
        this.Follows = models.Follows
    }
    async CheckUserFollow(userId, shopId) {
        const result = await this.Follows.findOne({
            where: {
                UserId: userId,
                ShopId: shopId
            }
        })
        return !!result
    }
    async createFollow(userId, shopId) {
        return await this.Follows.findOrCreate({
            where: { UserId: userId, ShopId: shopId }
        });
    }

    async deleteFollow(userId, shopId) {
        return await this.Follows.destroy({
            where: { UserId: userId, ShopId: shopId }
        });
    }
}
module.exports = FollowRepository