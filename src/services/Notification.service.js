const RepositoryFactory = require("../models/repositories/repositoryFactory")
const admin = require("../config/firebase")
class NotfiticationService {
    static async sendNotification(userId, title, body) {
        await RepositoryFactory.initialize();
        const UserRepository = RepositoryFactory.getRepository("UserRepository");
        const user = await UserRepository.findOne({ id: userId });
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

        await admin.messaging().send(message);
        return { message: "Notification sent" };
    }
    static async getAllNotification(userId, cursor, limit = 10){
        await RepositoryFactory.initialize()
        const NotificationRepo = RepositoryFactory.getRepository("NotificationRepository")
        return await NotificationRepo.findAllNotification(userId,cursor,limit)
    }
    static async updateNotification(id,userId){
        await RepositoryFactory.initialize()
        const NotificationRepo = RepositoryFactory.getRepository("NotificationRepository")
        return await NotificationRepo.updateNotification(id,userId)
    }
}

module.exports = NotfiticationService