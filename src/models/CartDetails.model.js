const {DataTypes, Model} = require("@sequelize/core");
const database = require("../db/dbs/db");
const sequelize = database.sequelize;
const Cart = require("./Cart.model");
const Product = require("./Products.model");
class CartDetails extends Model {}
CartDetails.init({
    CartId:{
        type:DataTypes.INTEGER,
        references:{
            model:Cart,
            key:"id"
        },
        allowNull:false
    },
    ProductId:{
        type:DataTypes.INTEGER,
        references:{
            model:Product,
            key:"id"
        },
        allowNull:false
    },
    quantity:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
},{
    sequelize,
    modelName:"CartDetails",
    tableName:"CartDetails",
    freezeTableName:true,
    timestamps:true
})
module.exports = CartDetails;