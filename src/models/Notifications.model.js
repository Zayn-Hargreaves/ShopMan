const {DataTypes, Model} = require("@sequelize/core");
const database = require("../db/dbs/db");
const sequelize = database.sequelize;
const User = require("./User.model");
const Shop = require("./Shop.model");
class Notifications extends Model {}
Notifications.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type:{
        type: DataTypes.STRING,
        allowNull: false
    },
    option:{
        type: DataTypes.STRING,
        allowNull: false
    },
    content:{
        type: DataTypes.STRING,
        allowNull: false
    },
    ShopId:{
        type: DataTypes.INTEGER,
        references:{
            model:Shop,
            key:"id"
        }
    },
    UserId:{
        type: DataTypes.INTEGER,
        references:{
            model:User,
            key:"id"
        }
    },
},{
    sequelize,
    tableName:"Notification",
    modelName:"Notification",
    freezeTableName:true,
    timestamps:true
})

module.exports = Notifications;