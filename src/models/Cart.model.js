const { DataTypes, Model } = require('sequelize');

class Cart extends Model {}
const initializeCart = async (sequelize) => {
    Cart.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        UserId: {
            type: DataTypes.INTEGER
        },
        cart_status: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Carts',
        tableName: 'Carts',
        freezeTableName: true,
        timestamps: true,
        indexes: [
            { fields: ['UserId'] }, // Index đơn trường
            { fields: ['UserId', 'cart_status'] } // Index composite
        ]
    });
    return Cart;
};

module.exports = initializeCart;