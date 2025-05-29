const { DataTypes, Model } = require('sequelize');

class Resource extends Model {}
const initializeResource = async (sequelize) => {
    Resource.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: ''
        }
    }, {
        sequelize,
        modelName: 'Resources',
        tableName: 'Resources',
        freezeTableName: true,
        timestamps: true,
        indexes: [
            { fields: ['name'] }
        ]
    });
    return Resource;
};

module.exports = initializeResource;