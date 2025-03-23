const {DataTypes, Model} = require("@sequelize/core");

class Payment extends Model {}
const initializePayment = async(sequelize)=>{

    Payment.init({
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
        payment_TotalPrice:{
            type:DataTypes.DECIMAL,
            allowNull:false
        },
        payment_Status:{
            type:DataTypes.STRING,
            allowNull:false
        },
        OrderId:{
            type:DataTypes.INTEGER,
            // references:{
            //     model:"Orders",
            //     key:"id"
            // },
            allowNull:false
        },
        PaymentMethodId:{
            type:DataTypes.INTEGER,
            // references:{
            //     model:"PaymentMethods",
            //     key:"id"
            // },
            allowNull:false
        },
    },{
        sequelize,
        tableName:"Payments",
        modelName:"Payments",
        freezeTableName:true,
        timestamps:true
    })
    return Payment
}

module.exports = initializePayment;