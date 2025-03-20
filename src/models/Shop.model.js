const {DataTypes, Model} = require("@sequelize/core");
const database = require("../db/dbs/db");
const sequelize = database.sequelize;
class Shop extends Model {}
Shop.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    UserId:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ShopName:{
        type: DataTypes.STRING,
        allowNull: false
    },
    status:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "inactive"
    },
    description:{
        type: DataTypes.STRING,
    }
},{
    sequelize,
    tableName: "Shop",
    modelName: "Shop",
    freezeTableName: true,
    paranoid: true,
    timestamps: true,
})
module.exports = Shop;
