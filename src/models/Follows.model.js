const {DataTypes, Model} = require('@sequelize/core');
const database = require('../db/dbs/db');
const sequelize = database.sequelize;
const User = require('./User.model');
const Shop = require('./Shop.model');
class Follows extends Model {}

Follows.init({
    UserId:{
        type:DataTypes.INTEGER,
        references:{
            model:User,
            key:"id"
        }
    },
    ShopId:{
        type:DataTypes.INTEGER,
        references:{
            model:Shop,
            key:"id"
        }
    },
},{
    sequelize,
    modelName:"Follow",
    tableName:"Follow",
    freezeTableName:true,
    timestamps:true
})

module.exports = Follows;