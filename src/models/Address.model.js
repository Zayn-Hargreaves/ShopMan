const { DataTypes, Model } = require('sequelize');

class Address extends Model {}
const initializeAddress = async (sequelize) => {
    Address.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        address_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pincode: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        tableName: 'Address',
        modelName: 'Address',
        timestamps: true,
        indexes: [
            { fields: ['UserId'] }, // Index đơn trường
            { fields: ['UserId', 'address_type'] } // Index composite
        ]
    });
    return Address;
};

module.exports = initializeAddress;