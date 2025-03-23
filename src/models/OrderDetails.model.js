const {DataTypes, Model} = require("@sequelize/core");


class OrderDetails extends Model {}
const initializeOrderDetails = async(sequelize)=>{

    OrderDetails.init({
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        OrderId:{
            type:DataTypes.INTEGER,
            // references:{
            //     model:"Orders",
            //     key:"id"
            // }
        },
        ProductId:{  
            type:DataTypes.INTEGER,
            // references:{
            //     model:"Products",
            //     key:"id"
            // }
        },
        quantity:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        price:{
            type:DataTypes.DECIMAL,
            allowNull:false
        }
    },{
        sequelize, 
        tableName:"OrdersDetails",
        modelName:"OrdersDetails",
        freezeTableName:true,
        timestamps:true
    })
    return OrderDetails
}

module.exports = initializeOrderDetails;