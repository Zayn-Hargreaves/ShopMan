const {DataTypes, Model} = require("@sequelize/core");
const database = require("../db/dbs/db");
const sequelize = database.sequelize;
const Shop = require("./Shop.model");
class Discounts extends Model {}
Discounts.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    description:{
        type: DataTypes.STRING,
    },
    value:{
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    type:{
        type: DataTypes.STRING,
        allowNull: false
    },
    code:{
        type: DataTypes.STRING,
        allowNull: false
    },
    StartDate:{
        type: DataTypes.DATE,
        allowNull: false
    },
    EndDate:{
        type: DataTypes.DATE,
        allowNull: false
    },
    MaxUses:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    UserCounts:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    MinValueOrders:{
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    status:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:"active"
    },
    ShopId:{
        type: DataTypes.INTEGER,
        references:{
            model:Shop,
            key:"id"
        },
        allowNull: false
    },
},{
    sequelize,
    modelName:"Discounts",
    tableName:"Discounts",
    freezeTableName:true,
    timestamps:true
})

module.exports = Discounts;