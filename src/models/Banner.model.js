
const {DataTypes, Model} = require('sequelize')
class Banner extends Model{}
const initializeBanner = async(sequelize)=>{
    Banner.init({
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        banner_type:{
            type:DataTypes.STRING,
            allowNull:false
        },
        title:{
            type:DataTypes.STRING,
            allowNull:false
        },
        thumb:{
            type:DataTypes.STRING,
            allowNull:false
        },
        link_type:{
            type:DataTypes.STRING,
            allowNull:false
        },
        link_target:{
            type:DataTypes.STRING,
            allowNull:false
        },
        position:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        start_time:{
            type:DataTypes.DATE,
            allowNull:false
        },
        end_time:{
            type:DataTypes.DATE,
            allowNull:false
        },
        priority:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        status:{
            type:DataTypes.STRING,
            allowNull:false
        },
        fee:{
            type:DataTypes.DECIMAL,
            allowNull:false
        },
        ShopId:{
            type:DataTypes.INTEGER,
        },
        PartnerId:{
            type:DataTypes.INTEGER,
        },
        CampaignId:{
            type:DataTypes.INTEGER,
        },
        slug:{
            type:DataTypes.STRING,
            unique:true
        }
    },{
        sequelize,
        tableName:"Banners",
        modelName:"Banners",
        timestamps:true
    })
    Banner.addHook("beforeCreate", (banner) => {
        banner.slug = banner.title.toLowerCase().replace(/ /g, "-");
    })
    return Banner
}

module.exports = initializeBanner