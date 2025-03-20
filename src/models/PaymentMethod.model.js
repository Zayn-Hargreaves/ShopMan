const {DataTypes, Model} = require('@sequelize/core');
const database = require('../db/dbs/db');
const sequelize = database.sequelize;
class PaymentMethod extends Model {}
PaymentMethod.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    description:{
        type:DataTypes.STRING,
    },
    status:{
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue:"active"
    }
},{
    sequelize,
    modelName:"PaymentMethod",
    tableName:"PaymentMethod",
    freezeTableName:true,
    timestamps:true
})
module.exports = PaymentMethod;