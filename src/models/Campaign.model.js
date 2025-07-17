const { DataTypes, Model } = require('sequelize');

class Campaign extends Model { }
const initializeCampaign = async (sequelize) => {
    Campaign.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        thumb: {
            type: DataTypes.STRING,
            allowNull: true
        },
        start_time: {
            type: DataTypes.DATE,
            allowNull: false
        },
        end_time: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { isIn: [['active', 'inactive']] }
        },
        slug: {
            type: DataTypes.STRING,
        }
    }, {
        sequelize,
        tableName: 'Campaigns',
        modelName: 'Campaign',
        timestamps: true,
        indexes: [
            { fields: ['status'] },
            { fields: ['status', 'start_time', 'end_time'] } // Index composite
        ]
    });
    Campaign.addHook('beforeValidate', (campaign) => {
        if (!campaign.slug && campaign.title) {
            campaign.slug = campaign.title.toLowerCase().replace(/ /g, '-');
        }
    });

    return Campaign;
};

module.exports = initializeCampaign;