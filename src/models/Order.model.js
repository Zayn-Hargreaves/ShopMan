const {DataTypes, Model} = require("@sequelize/core");
const database = require("../db/dbs/db");
const sequelize = database.sequelize;
const User = require("./User.model");

class Order extends Model {}
Order.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    UserId:{
        type:DataTypes.INTEGER,
        references:{
            model:User,
            key:"id"
        }
    },
    TotalPrice:{
        type:DataTypes.DECIMAL,
        allowNull:false
    },
    Status:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    sequelize,
    tableName:"Orders",
    modelName:"Orders",
    freezeTableName:true,
    timestamps:true
})

module.exports = Order;