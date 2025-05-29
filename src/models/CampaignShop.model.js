const { DataTypes, Model } = require('sequelize');

class CampaignShop extends Model {}
const initializeCampaignShop = async (sequelize) => {
    CampaignShop.init({
        CampaignId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: { model: 'Campaigns', key: 'id' }
        },
        ShopId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: { model: 'Shops', key: 'id' }
        }
    }, {
        sequelize,
        tableName: 'CampaignShops',
        modelName: 'CampaignShop',
        timestamps: false,
        indexes: [
            { fields: ['ShopId'] }
        ]
    });
    return CampaignShop;
};

module.exports = initializeCampaignShop;