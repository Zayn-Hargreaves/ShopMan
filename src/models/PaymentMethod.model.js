const {DataTypes, Model} = require('@sequelize/core');

class PaymentMethod extends Model {}
const initializePaymentMethod = async(sequelize)=>{

    PaymentMethod.init({
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        paymentMethod_name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        paymentMethod_desc:{
            type:DataTypes.STRING,
        },
        paymentMethod_status:{
            type:DataTypes.STRING,
            allowNull:false,
            defaultValue:"active"
        }
    },{
        sequelize,
        modelName:"PaymentMethods",
        tableName:"PaymentMethods",
        freezeTableName:true,
        timestamps:true
    })
    return PaymentMethod
}
module.exports = initializePaymentMethod;