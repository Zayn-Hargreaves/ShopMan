const {DataTypes, Model} = require("@sequelize/core");
const database = require("../db/dbs/db");
const sequelize = database.sequelize;
const User = require("./User.model");
const Product = require("./Products.model");
class Comment extends Model {}

Comment.init({
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
    ProductId:{
        type:DataTypes.INTEGER,
        references:{
            model:Product,
            key:"id"
        }
    },
    rating:{
        type:DataTypes.INTEGER,
        validate: { min: 1, max: 5 } // 1-5 sao
    },
    content:{
        type:DataTypes.STRING,
        allowNull:false
    },
    left:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    right:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
},{
    sequelize,
    modelName:"Comment",
    tableName:"Comment",
    freezeTableName:true,
    timestamps:true
})

module.exports = Comment;