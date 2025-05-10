class NotificationRepository {
    constructor(models) {
      this.Notifications = models.Notifications;
    }
  
    async create(data, options) {
      return await this.Notifications.create(data, options);
    }
  }
  
  module.exports = NotificationRepository;