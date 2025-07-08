const { Op, where } = require("sequelize");
const { getUnselectData } = require("../../utils");
class NotificationRepository {
  constructor(models) {
    this.Notifications = models.Notifications;
  }

  async create(data, options) {
    return await this.Notifications.create(data, options);
  }
  async findAllNotification(userId, cursor, limit) {
    const whereClause = { UserId: userId }
    if (cursor) {
      const cursorDate = new Date(cursor)
      whereClause.createdAt = { [Op.lte]: cursorDate }
    }
    const notifications = await this.Notifications.findAll({
      where: whereClause,
      limit: limit + 1,
      order: [['createdAt', 'DESC'], ['id', "DESC"]],
      attributes: getUnselectData(['ShopId', 'UserId'])
    })
    const hasMore = notifications.length > limit
    if (hasMore) notifications.pop()
    const result = {
      totalItem: await this.Notifications.count({ where: { UserId: userId } }),
      notifications: notifications,
      nextCursor: hasMore ? notifications[notifications.length - 1].createdAt : null
    }
    return result
  }
  async updateNotification(id,userId){
    return await this.Notifications.update({isRead:true},{where:{id:id,UserId:userId}})
  }
}

module.exports = NotificationRepository;