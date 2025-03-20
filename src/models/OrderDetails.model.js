const {DataTypes, Model} = require("@sequelize/core");
const database = require("../db/dbs/db");
const sequelize = database.sequelize;
const Order = require("./Order.model");
const Product = require("./Products.model");

class OrderDetails extends Model {}

OrderDetails.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    OrderId:{
        type:DataTypes.INTEGER,
        references:{
            model:Order,
            key:"id"
        }
    },
    ProductId:{  
        type:DataTypes.INTEGER,
        references:{
            model:Product,
            key:"id"
        }
    },
    quantity:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    price:{
        type:DataTypes.DECIMAL,
        allowNull:false
    }
},{
    sequelize, 
    tableName:"OrderDetails",
    modelName:"OrderDetails",
    freezeTableName:true,
    timestamps:true
})

module.exports = OrderDetails;