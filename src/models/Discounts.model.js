const {DataTypes, Model} = require("@sequelize/core");

class Discounts extends Model {}
const initializeDiscounts = async(sequelize)=>{
    Discounts.init({
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        discount_name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        discount_desc:{
            type: DataTypes.STRING,
        },
        discount_value:{
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        discount_type:{
            type: DataTypes.STRING,
            allowNull: false
        },
        discount_code:{
            type: DataTypes.STRING,
            allowNull: false
        },
        discount_StartDate:{
            type: DataTypes.DATE,
            allowNull: false
        },
        discount_EndDate:{
            type: DataTypes.DATE,
            allowNull: false
        },
        discount_MaxUses:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        discount_UserCounts:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        discount_MinValueOrders:{
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        discount_status:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue:"active"
        },
        ShopId:{
            type: DataTypes.INTEGER,
            // references:{
            //     model:"Shops",
            //     key:"id"
            // },
            allowNull: false
        },
    },{
        sequelize,
        modelName:"Discounts",
        tableName:"Discounts",
        freezeTableName:true,
        timestamps:true
    })
    return Discounts
}

module.exports = initializeDiscounts;