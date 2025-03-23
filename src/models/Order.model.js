const {DataTypes, Model} = require("@sequelize/core");


class Order extends Model {}
const initializeOrder = async(sequelize)=>{
    Order.init({
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
        order_TotalPrice:{
            type:DataTypes.DECIMAL,
            allowNull:false
        },
        order_Status:{
            type:DataTypes.STRING,
            allowNull:false
        }
    },{
        sequelize,
        tableName:"Orders",
        modelName:"Orders",
        freezeTableName:true,
        timestamps:true
    })
    return Order
}

module.exports = initializeOrder;