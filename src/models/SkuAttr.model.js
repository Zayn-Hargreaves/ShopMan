const { DataTypes, Model } = require("@sequelize/core");

class SkuAttr extends Model { }
const initializeSkuAttr = async (sequelize) => {
    SkuAttr.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        sku_no: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            default: ""
        },
        sku_stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        sku_price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 0
        },
        sku_attrs: {
            type: DataTypes.JSON,
            allowNull: true,
        }
    }, {
        sequelize,
        modelName: "SkuAttr",
        tableName: "SkuAttr",
        freezeTableName: true,
        timestamps: true,
        underscored: true,
        indexes: []
    })
    return SkuAttr
}

module.exports = initializeSkuAttr