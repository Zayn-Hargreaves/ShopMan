const {DataTypes, Model} = require("@sequelize/core");
class Comment extends Model {}
const initializeComments = async(sequelize)=>{
    Comment.init({
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        UserId:{
            type:DataTypes.INTEGER,
            // references:{
            //     model:"Users",
            //     key:"id"
            // }
        },
        ProductId:{
            type:DataTypes.INTEGER,
        //     references:{
        //         model:"Products",
        //         key:"id"
        //     }
        },
        rating:{
            type:DataTypes.INTEGER,
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
        modelName:"Comments",
        tableName:"Comments",
        freezeTableName:true,
        timestamps:true
    })
    return Comment
}

module.exports = initializeComments;