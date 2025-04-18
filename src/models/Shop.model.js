const {DataTypes, Model} = require("@sequelize/core");

class Shop extends Model {}
const initializeShop = async(sequelize)=>{
    Shop.init({
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        UserId:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        balance:{
            type:DataTypes.DECIMAL,
            allowNull:false,
            defaultValue:0
        },
        status:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "pending"
        },
        RolesId:{
            type: DataTypes.INTEGER,
        },
        shop_desc:{
            type: DataTypes.STRING,
        },
        slug:{
            type:DataTypes.STRING,
            allowNull:false
        }
    },{
        sequelize,
        tableName: "Shops",
        modelName: "Shops",
        freezeTableName: true,
        paranoid: true,
        timestamps: true,
    })
    Shop.addHook("beforeCreate",(shop)=>{
        shop.slug = shop.name.toLowerCase().replace(/ /g, "-")
    })
    return Shop
}
module.exports = initializeShop;
