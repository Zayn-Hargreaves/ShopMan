const { DataTypes, Model } = require('sequelize');

class Payment extends Model {}
const initializePayment = async (sequelize) => {
    Payment.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        UserId: {
            type: DataTypes.INTEGER
        },
        TotalPrice: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        Status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        OrderId: {
            type: DataTypes.INTEGER
        },
        PaymentMethodId: {
            type: DataTypes.INTEGER
        }
    }, {
        sequelize,
        tableName: 'Payments',
        modelName: 'Payments',
        freezeTableName: true,
        timestamps: true,
        indexes: [
            { fields: ['UserId'] },
            { fields: ['Status'] },
            { fields: ['OrderId'] },
            { fields: ['PaymentMethodId'] },
            { fields: ['UserId', 'Status'] }
        ]
    });
    return Payment;
};

module.exports = initializePayment;