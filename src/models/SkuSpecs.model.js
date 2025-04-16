const {DataTypes, Model} = require("@sequelize/core");
class SkuSpecs extends Model{}
const initializeSkuSpecs = async(sequelize)=>{
    SkuSpecs.init({
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        sku_specs:{
            type:DataTypes.JSON,
            allowNull:true,
        }
    },{
        sequelize,
        modelName:"SkuSpecs",
        tableName:"SkuSpecs",
        freezeTableName:true,
        timestamps:true,
        underscored:true,
    })
    return SkuSpecs
}

module.exports = initializeSkuSpecs