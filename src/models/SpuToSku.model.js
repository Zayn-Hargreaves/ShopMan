const { DataTypes, Model } = require("@sequelize/core");
class SpuToSku extends Model { }
const initializeSpuToSku = async (sequelize) => {
    SpuToSku.init({
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
        spu_no: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            default: ""
        },
    }, {
        sequelize,
        modelName: "SpuToSku",
        tableName: "SpuToSku",
        freezeTableName: true,
        paranoid: true,
        timestamps: true,
        underscored: true,
        indexes: [
            {
                fields: ['spu_no', 'sku_no'],
            },
        ],
    })
    return SpuToSku
}

module.exports = initializeSpuToSku