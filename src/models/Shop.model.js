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
        shop_name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        shop_balance:{
            type:DataTypes.DECIMAL,
            allowNull:false,
            defaultValue:0
        },
        shop_status:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "pending"
        },
        RolesId:{
            type: DataTypes.INTEGER,
            // references:{
            //     model:"Roles",
            //     key:"id"
            // }
        },
        shop_desc:{
            type: DataTypes.STRING,
        }
    },{
        sequelize,
        tableName: "Shops",
        modelName: "Shops",
        freezeTableName: true,
        paranoid: true,
        timestamps: true,
    })
    return Shop
}
module.exports = initializeShop;
