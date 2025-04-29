
const {DataTypes, Model} = require('sequelize')
class CampaignShop extends Model{}
const initializeCampaignShop = async(sequelize)=>{
    CampaignShop.init({
        CampaignId:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        ShopId:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
    },{
        sequelize,
        tableName:"CampaignShops",
        modelName:"CampaignShops",
        timestamps:false
    })
    return CampaignShop
}

module.exports = initializeCampaignShop