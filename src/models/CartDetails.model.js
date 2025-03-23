const {DataTypes, Model} = require("@sequelize/core");

class CartDetails extends Model {}
const initializeCartDetails = async(sequelize)=>{
    CartDetails.init({
        CartId:{
            type:DataTypes.INTEGER,
            // references:{
            //     model:"Carts",
            //     key:"id"
            // },
            allowNull:false
        },
        ProductId:{
            type:DataTypes.INTEGER,
            // references:{
            //     model:"Products",
            //     key:"id"
            // },
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