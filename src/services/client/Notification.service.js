const RepositoryFactory = require("../../models/repositories/repositoryFactory")
const admin = require("../../config/firebase")
class NotfiticationService {
    static async sendNotification(userId, title, body) {
        await RepositoryFactory.initialize();
        const UserRepository = RepositoryFactory.getRepository("UserRepository");
        const user = await UserRepository.findById(userId);
        if (!user || !user.fcmToken) {
            throw new BadRequestError("No FCM token found");
        }

        const message = {
            notification: {
                title,
                body
            },
            token: user.fcmToken
        };

        try {
            // Gửi notification
            const response = await admin.messaging().send(message);
            console.log(`[NOTI] Sent notification to user ${userId}, messageId: ${response}`);
            return { message: "Notification sent", messageId: response };
        } catch (error) {
            console.error(`[NOTI] Failed to send notification to user ${userId}:`, error);
            throw error;
        }
    }
    static async getAllNotification(userId, cursor, limit = 10) {
        await RepositoryFactory.initialize()
        const NotificationRepo = RepositoryFactory.getRepository("NotificationRepository")
        return await NotificationRepo.findAllNotification(userId, cursor, limit)
    }
    static async updateNotification(id, userId) {
        await RepositoryFactory.initialize()
        const NotificationRepo = RepositoryFactory.getRepository("NotificationRepository")
        return await NotificationRepo.updateNotification(id, userId)
    }
}

module.exports = NotfiticationService