const { NotFoundError } = require("../../cores/error.response");
const RepositoryFactory = require("../../models/repositories/repositoryFactory");

class NotificationService {
    /**
     * Liệt kê notification (theo shop, user, hoặc toàn hệ thống)
     * @param {Number} shopId - nếu muốn lấy noti của 1 shop (shopId == null: lấy tất cả hoặc của user)
     * @param {Object} query - filter: userId, type, isRead, page, limit, from, to
     */
    static async listNotifications(shopId, query = {}) {
        await RepositoryFactory.initialize();
        const NotificationRepo = RepositoryFactory.getRepository("NotificationRepository");

        let {
            userId,        // lấy noti của 1 user
            type,          // "order", "system", ...
            isRead,        // true/false
            from, to,      // theo thời gian
            page = 1,
            limit = 20,
        } = query;

        return await NotificationRepo.findAllNotificationByPagePagination(shopId, userId, type, isRead, from, to, parseInt(page), parseInt(limit) )    }

    // Đánh dấu đã đọc notification
    static async markAsRead(notificationId, userId) {
        await RepositoryFactory.initialize();
        const NotificationRepo = RepositoryFactory.getRepository("NotificationRepository");
        const noti = await NotificationRepo.findOne({ where: { id: notificationId, UserId: userId } });
        if (!noti) throw new NotFoundError('Notification not found');
        noti.isRead = true;
        await noti.save();
        return noti;
    }

    // Gửi noti mới
    static async sendNotification({ type, option, content, ShopId, UserId, meta }) {
        await RepositoryFactory.initialize();
        const NotificationRepo = RepositoryFactory.getRepository("NotificationRepository");
        const noti = await NotificationRepo.create({
            type, option, content, ShopId, UserId, meta,
            isRead: false,
            isHandled: false
        });
        return noti;
    }
}

module.exports = NotificationService;
