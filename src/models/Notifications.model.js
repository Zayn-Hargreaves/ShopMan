const { DataTypes, Model } = require('sequelize');

class Notification extends Model {}

const initializeNotification = async (sequelize) => {
    Notification.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        // "order", "product", "discount", "system", "chat", ...
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // "success", "fail", "new", "price_drop", ...
        option: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        // Nội dung text để hiển thị
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // Id Shop (nếu cần gửi cho Shop)
        ShopId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        // Id User (người nhận)
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        // Trạng thái đã đọc/chưa đọc
        isRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        // Trạng thái đã xử lý chưa, dùng cho action noti (optional)
        isHandled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        // Meta chứa link/id... (JSONB cho Postgres, JSON cho MySQL)
        meta: {
            type: DataTypes.JSONB,
            allowNull: true,
        }
    }, {
        sequelize,
        tableName: 'Notifications',
        modelName: 'Notifications',
        freezeTableName: true,
        timestamps: true,
        indexes: [
            { fields: ['UserId'] },
            { fields: ['ShopId'] },
            { fields: ['type'] },
            { fields: ['UserId', 'type'] },
            { fields: ['isRead'] }
        ]
    });
    return Notification;
};

module.exports = initializeNotification;
