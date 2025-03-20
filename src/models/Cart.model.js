const {DataTypes, Model} = require("@sequelize/core");
const database = require("../db/dbs/db");
const sequelize = database.sequelize;
const User = require("./User.model");
class Cart extends Model {}
Cart.init({
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
    total:{
        type:DataTypes.DECIMAL,
        allowNull:false
    },
    status:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    sequelize,
    modelName:"Cart",
    tableName:"Cart",
    freezeTableName:true,
    timestamps:true
})

module.exports = Cart;