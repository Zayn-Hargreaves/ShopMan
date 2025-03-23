const {DataTypes, Model} = require("@sequelize/core")

class ProductVariation extends Model{}
const initializeProductVariation = async(sequelize)=>{
    ProductVariation.init({
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        ProductId:{
            type:DataTypes.INTEGER,
            allowNull:false,
            // references:{
            //     model:"Products",
            //     key:"id"
            // }
        },
        sku:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true
        },
        price:{
            type:DataTypes.DECIMAL,
            allowNull:false,
        },
        quantity:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        attributes:{
            type:DataTypes.JSON,
            allowNull:false
        }
    },{
        sequelize,
        modelName:"ProductVariations",
        tableName:"ProductVariations",
        freezeTableName:true,
        timestamps:true
    })
    return ProductVariation;
}

module.exports = initializeProductVariation