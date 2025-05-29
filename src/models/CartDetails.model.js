const { DataTypes, Model } = require('sequelize');

class CartDetails extends Model {}
const initializeCartDetails = async (sequelize) => {
    CartDetails.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        CartId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ProductId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sku_no: {
            type: DataTypes.STRING,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'CartsDetails',
        tableName: 'CartsDetails',
        freezeTableName: true,
        timestamps: true,
        indexes: [
            { fields: ['CartId'] },
            { fields: ['ProductId'] },
            { fields: ['sku_no'] },
            { fields: ['CartId', 'ProductId'] } // Index composite
        ]
    });
    return CartDetails;
};

module.exports = initializeCartDetails;