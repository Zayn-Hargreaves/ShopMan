const {DataTypes, Model} = require("@sequelize/core");
class WishLists extends Model {}
const initializeWishLists = async(sequelize)=>{

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
    return WishLists
}
module.exports = initializeWishLists;