const { DataTypes, Model } = require('sequelize');

class Order extends Model { }
const initializeOrder = async (sequelize) => {
    Order.init({
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
        AddressId:{
            type:DataTypes.INTEGER,
        },
        PaymentMethodId:{
            type:DataTypes.INTEGER,
        },
        shippingProvider: { type: DataTypes.STRING },
        shippingTrackingCode: { type: DataTypes.STRING },
        shippingStatus: { type: DataTypes.STRING },
        shippingFee: { type: DataTypes.DECIMAL },
        Status: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        tableName: 'Orders',
        modelName: 'Orders',
        freezeTableName: true,
        timestamps: true,
        indexes: [
            { fields: ['UserId'] },
            { fields: ['Status'] },
            { fields: ['UserId', 'Status'] }
        ]
    });
    return Order;
};

module.exports = initializeOrder;