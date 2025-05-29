const { DataTypes, Model } = require('sequelize');

class CampaignCategory extends Model {}
const initializeCampaignCategory = async (sequelize) => {
    CampaignCategory.init({
        CampainId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: { model: 'Campaigns', key: 'id' }
        },
        CategoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: { model: 'Categories', key: 'id' }
        }
    }, {
        sequelize,
        tableName: 'CampaignCategories',
        modelName: 'CampaignCategory',
        timestamps: false,
        indexes: [
            { fields: ['CategoryId'] }
        ]
    });
    return CampaignCategory;
};

module.exports = initializeCampaignCategory;