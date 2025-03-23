const {DataTypes, Model} = require("@sequelize/core");
class DiscountsProducts extends Model {}
const initializeDiscountsProducts = async(sequelize)=>{

    DiscountsProducts.init({
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        DiscountId:{
            type:DataTypes.INTEGER,
            // references:{
            //     model:"Discounts",
            //     key:"id"
            // }
        },
        ProductId:{
            type:DataTypes.INTEGER,
            // references:{
            //     model:"Products",
            //     key:"id"
            // }
        }
    },{
        sequelize,
        modelName:"DiscountsProducts",
        tableName:"DiscountsProducts",
        freezeTableName:true,
        timestamps:true
    })
    return DiscountsProducts
}

module.exports = initializeDiscountsProducts;