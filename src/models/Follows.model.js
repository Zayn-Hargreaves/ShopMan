const { DataTypes, Model } = require('sequelize');

class Follows extends Model {}
const initializeFollows = async (sequelize) => {
    Follows.init({
        UserId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        ShopId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        }
    }, {
        sequelize,
        modelName: 'Follows',
        tableName: 'Follows',
        freezeTableName: true,
        timestamps: true,
        indexes: [
            { fields: ['UserId'] },
            { fields: ['ShopId'] }
        ]
    });
    return Follows;
};

module.exports = initializeFollows;