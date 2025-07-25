const { DataTypes, Model } = require('sequelize');

class OrderDetails extends Model {}
const initializeOrderDetails = async (sequelize) => {
    OrderDetails.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        OrderId: {
            type: DataTypes.INTEGER
        },
        ProductId: {
            type: DataTypes.INTEGER
        },
        sku_no:{
            type:DataTypes.STRING,
        },
        ShopId: { type: DataTypes.INTEGER },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        price_at_time: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        status:{
            type:DataTypes.STRING,
            defaultValue:"active"
        }
    }, {
        sequelize,
        tableName: 'OrdersDetails',
        modelName: 'OrdersDetails',
        freezeTableName: true,
        timestamps: true,
        indexes: [
            { fields: ['OrderId'] },
            { fields: ['ProductId'] },
            { fields: ['OrderId', 'ProductId'], unique: true }
        ]
    });
    return OrderDetails;
};

module.exports = initializeOrderDetails;