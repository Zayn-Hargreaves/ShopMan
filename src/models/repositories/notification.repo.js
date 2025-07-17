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
  async updateNotification(id, userId) {
    return await this.Notifications.update({ isRead: true }, { where: { id: id, UserId: userId } })
  }
  async findAllNotificationByPagePagination(ShopId, UserId, type, isRead, from, to, page, limit) {
    let where = {}
    if (ShopId) where.ShopId = ShopId
    if (UserId) where.UserId = UserId
    if (type) where.type = type;
    if (typeof isRead !== "undefined") where.isRead = isRead === "true" || isRead === true;
    if (from || to) {
      where.createdAt = {}
      if (from) where.createdAt[Op.gte] = new Date(from)
      if (to) where.createdAt[Op.lte] = new Date(to)
    }
    const offset = (page - 1) * limit
    const { rows, count } = await this.Notifications.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    })
    return {
      items: rows,
      total:count, 
      page,
      limit,
      totalPages: Math.ceil(count/limit)
    }
  }
  async findNotificationById(id, UserId){
    return await this.Notifications.findOne({where:{id,UserId}})
  }
  
}

module.exports = NotificationRepository;