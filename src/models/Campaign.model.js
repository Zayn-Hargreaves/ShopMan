const {DataTypes, Model} = require("@sequelize/core")
class Campaign extends Model{}
const initializeCampaign = async(sequelize)=>{
    Campaign.init({
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        title:{
            type:DataTypes.STRING,
            allowNull:false
        },
        description:{
            type:DataTypes.TEXT,
            allowNull:true
        },
        start_time:{
            type:DataTypes.DATE,
            allowNull:false
        },
        end_time:{
            type:DataTypes.DATE,
            allowNull:false
        },
        status:{
            type:DataTypes.STRING,
            allowNull:false,
            validate: {
                isIn: [['active', 'inactive']]
            }
        }
    },{
        sequelize,
        tableName:"Campaigns",
        modelName:"Campaigns",
        timestamps:true
    })
    return Campaign
}

module.exports = initializeCampaign