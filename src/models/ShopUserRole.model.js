const { DataTypes, Model } = require('sequelize');

class ShopUserRole extends Model {}

const initializeShopUserRole = async (sequelize) => {
    ShopUserRole.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ShopId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'ID của shop'
        },
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'ID của user'
        },
        RoleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'ID của role'
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'active', // Có thể dùng: active, pending, banned...
            comment: 'Trạng thái thành viên shop'
        },
        joinedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            comment: 'Thời điểm tham gia shop'
        }
    }, {
        sequelize,
        tableName: 'ShopUserRoles',
        modelName: 'ShopUserRole',
        freezeTableName: true,
        timestamps: true,
        indexes: [
            { fields: ['ShopId'] },
            { fields: ['UserId'] },
            { fields: ['RoleId'] },
            { fields: ['ShopId', 'UserId'], unique: true }
        ]
    });
    return ShopUserRole;
};

module.exports = initializeShopUserRole;
