const { DataTypes, Model } = require('sequelize');

class Inventory extends Model {}
const initializeInventory = async (sequelize) => {
    Inventory.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        SkuId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Sku', key: 'id' }
        },
        ShopId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Shops', key: 'id' }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        tableName: 'Inventories',
        modelName: 'Inventory',
        timestamps: true,
        indexes: [
            { fields: ['SkuId'] }, // Index đơn trường
            { fields: ['ShopId'] },
            { fields: ['SkuId', 'ShopId'], unique: true } // Index composite + UNIQUE
        ]
    });
    return Inventory;
};

module.exports = initializeInventory;