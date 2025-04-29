const {DataTypes, Model} = require('sequelize')
const slugify = require("slugify")
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
        },
        slug:{
            type:DataTypes.STRING,
            allowNull:false
        }
    },{
        sequelize,
        tableName:"Campaigns",
        modelName:"Campaigns",
        timestamps:true
    })
    Campaign.addHook("beforeCreate",(campain)=>{
        campain.slug = campain.title.toLowerCase().replace(/ /g, "-");
    })
    return Campaign
}

module.exports = initializeCampaign