const {DataTypes, Model} = require("@sequelize/core");
const database = require("../db/dbs/db");
const sequelize = database.sequelize;
class WishLists extends Model {}
WishLists.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    UserId:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ProductId:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
},{
    sequelize,
    tableName:"WishLists",
    modelName:"WishLists",
    freezeTableName:true,
    timestamps:true
})
module.exports = WishLists;