const {DataTypes, Model} = require("@sequelize/core");
const database = require("../db/dbs/db");
const sequelize = database.sequelize;
const Discounts = require("./Discounts.model");
const Product = require("./Products.model");
class DiscountsProducts extends Model {}
DiscountsProducts.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    DiscountId:{
        type:DataTypes.INTEGER,
        references:{
            model:Discounts,
            key:"id"
        }
    },
    ProductId:{
        type:DataTypes.INTEGER,
        references:{
            model:Product,
            key:"id"
        }
    }
},{
    sequelize,
    modelName:"DiscountsProducts",
    tableName:"DiscountsProducts",
    freezeTableName:true,
    timestamps:true
})

module.exports = DiscountsProducts;