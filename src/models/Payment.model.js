const {DataTypes, Model} = require("@sequelize/core");
const database = require("../db/dbs/db");
const sequelize = database.sequelize;
const User = require("./User.model");
const Order = require("./Order.model");
const PaymentMethod = require("./PaymentMethod.model");
class Payment extends Model {}
Payment.init({
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
    },
    OrderId:{
        type:DataTypes.INTEGER,
        references:{
            model:Order,
            key:"id"
        },
        allowNull:false
    },
    PaymentMethodId:{
        type:DataTypes.INTEGER,
        references:{
            model:PaymentMethod,
            key:"id"
        },
        allowNull:false
    },
},{
    sequelize,
    tableName:"Payment",
    modelName:"Payment",
    freezeTableName:true,
    timestamps:true
})

module.exports = Payment;