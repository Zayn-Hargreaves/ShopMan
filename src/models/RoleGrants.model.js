const { DataTypes, Model } = require('sequelize');

class RoleGrant extends Model {}
const initializeRoleGrant = async (sequelize) => {
    RoleGrant.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            comment: 'grant id'
        },
        RoleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'role id'
        },
        ResourceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'resource id'
        },
        actions: {
            type: DataTypes.JSONB,
            allowNull: false,
            comment: 'list of actions'
        },
        attributes: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: '',
            comment: 'attributes allowed'
        }
    }, {
        sequelize,
        modelName: 'RoleGrant',
        tableName: 'RoleGrants',
        freezeTableName: true,
        timestamps: false,
        indexes: [
            { fields: ['RoleId'] },
            { fields: ['ResourceId'] },
            { fields: ['RoleId', 'ResourceId'], unique: true }
        ]
    });
    return RoleGrant;
};

module.exports = initializeRoleGrant;