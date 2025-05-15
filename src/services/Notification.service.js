const RepositoryFactory = require("../models/repositories/repositoryFactory")
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
}