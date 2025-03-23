const {DataTypes, Model } = require("@sequelize/core")
class Resource extends Model{}

const initializeResource = async (sequelize)=>{
    Resource.init({
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },
        resrc_name:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        resrc_slug:{
            type:DataTypes.STRING,
            allowNull:true,
            defaultValue:"",
        }
    },{
        sequelize,
        modelName:"Resources",
        tableName:"Resources",
        freezeTableName:true,
        timestamps:true,
    })
    return Resource
}

module.exports = initializeResource;