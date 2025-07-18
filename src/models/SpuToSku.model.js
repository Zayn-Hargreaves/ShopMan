const { DataTypes, Model } = require('sequelize');

class SpuToSku extends Model {}
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
            unique: true
        },
        spu_no: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'SpuToSku',
        tableName: 'SpuToSku',
        timestamps: false,
        freezeTableName: true,
        indexes: [
            { fields: ['spu_no'] },
            { fields: ['spu_no', 'sku_no'], unique: true }
        ]
    });
    return SpuToSku;
};

module.exports = initializeSpuToSku;