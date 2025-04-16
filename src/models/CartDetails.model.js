const {DataTypes, Model} = require("@sequelize/core");

class CartDetails extends Model {}
const initializeCartDetails = async(sequelize)=>{
    CartDetails.init({
        CartId:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        ProductId:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        quantity:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
    },{
        sequelize,
        modelName:"CartsDetails",
        tableName:"CartsDetails",
        freezeTableName:true,
        timestamps:true
    })
    return CartDetails
}
module.exports = initializeCartDetails;