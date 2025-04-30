class NotificationRepository {
    constructor(models) {
        this.Notifications = models.Notifications;
    }

    async notifyOrderSuccess(userId, content) {
        return await this.Notifications.create({
            type: "ORDER",
            option: "SUCCESS",
            content,
            UserId: userId,
        });
    }
}
module.exports = NotificationRepository;