const {DataTypes, Model} = require("@sequelize/core")
class Partner extends Model {}
const initializePartner = async(sequelize)=>{
    Partner.init({
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        contact_info:{
            type:DataTypes.STRING,
            allowNull:false
        },
        logo:{
            type:DataTypes.STRING,
        }
    },{
        sequelize,
        tableName:'Partners',
        modelName:"Partners",
        freezeTableName:true,
        timestamps:true
    })
    return Partner
}

module.exports = initializePartner