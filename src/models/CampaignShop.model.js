const {DataTypes, Model} = require("@sequelize/core")
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
        start_time:{
            type:DataTypes.DATE,
            allowNull:true
        },
        end_time:{
            type:DataTypes.DATE,
            allowNull:true
        }
    },{
        sequelize,
        tableName:"CampaignShops",
        modelName:"CampaignShops",
        timestamps:false
    })
    return CampaignShop
}

module.exports = initializeCampaignShop