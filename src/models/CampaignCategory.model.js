
const {DataTypes, Model} = require('sequelize')
class CampaignCategory extends Model{}
const initializeCampaignCategory = async(sequelize)=>{
    CampaignCategory.init({
        CampainId:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        CategoryId:{
            type:DataTypes.INTEGER,
            allowNull:false,
        }
    },{
        sequelize,
        tableName:"CampaignCategories",
        modelName:"CampaignCategories",
        timestamps:false
    })
    return CampaignCategory
}

module.exports = initializeCampaignCategory