const {DataTypes, Model} = require("@sequelize/core");
const database = require("../db/dbs/db");
const sequelize = database.sequelize;
const Product = require("./Products.model");
const Shop = require("./Shop.model");
class Inventories extends Model {}
Inventories.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ProductId:{
        type: DataTypes.INTEGER,
        references:{
            model:Product,
            key:"id"
        },
        allowNull: false
    },
    ShopId:{
        type: DataTypes.INTEGER,
        references:{
            model:Shop,
            key:"id"
        },
        allowNull: false
    },
    quantity:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    location:{
        type: DataTypes.STRING,
        allowNull: false
    },
},{
    sequelize,
    tableName:"Inventories",
    modelName:"Inventories",
    freezeTableName:true,
    timestamps:true
})

module.exports = Inventories;