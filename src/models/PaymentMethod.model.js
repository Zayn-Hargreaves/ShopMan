const {DataTypes, Model} = require('sequelize');

class PaymentMethod extends Model {}
const initializePaymentMethod = async(sequelize)=>{

    PaymentMethod.init({
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        desc:{
            type:DataTypes.STRING,
        },
        status:{
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