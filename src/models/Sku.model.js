const {DataTypes, Model} = require("@sequelize/core")

class Sku extends Model{}
const initializeSku = async(sequelize)=>{
    Sku.init({
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        sku_no:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true,
            default:""
        },
        sku_name:{
            type:DataTypes.STRING,
            allowNull:true,
        },
        sku_desc:{
            type:DataTypes.STRING,
            allowNull:true,
        },
        sku_type:{
            type:DataTypes.TINYINT,
            allowNull:true,
        },
        status:{
            type:DataTypes.STRING,
            allowNull:false,
            defaultValue:"active"
        },
        sort:{
            type:DataTypes.INTEGER,
            allowNull:false,
            defaultValue:0
        },
        sku_stock:{
            type:DataTypes.INTEGER,
            allowNull:false,
            defaultValue:0,
        },
        sku_price:{
            type:DataTypes.DECIMAL,
            allowNull:false,
            defaultValue:0
        },

    },{
        sequelize,
        modelName:"Sku",
        tableName:"Sku",
        freezeTableName:true,
        timestamps:true,
        underscored:true,
        indexes:[]
    })
    return Sku;
}

module.exports = initializeSku