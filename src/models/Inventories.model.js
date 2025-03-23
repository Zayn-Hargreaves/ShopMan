const {DataTypes, Model} = require("@sequelize/core");


class Inventories extends Model {}
const initializeInventories = async(sequelize)=>{
    Inventories.init({
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ProductId:{
            type: DataTypes.INTEGER,
            // references:{
            //     model:"Products",
            //     key:"id"
            // },
            allowNull: false
        },
        ShopId:{
            type: DataTypes.INTEGER,
            // references:{
            //     model:"Shops",
            //     key:"id"
            // },
            allowNull: false
        },
        inven_quantity:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        inven_location:{
            type: DataTypes.STRING,
            allowNull: false
        },
    },{
        sequelize,
        tableName:"Inventories",
        modelName:"Inventories",
        freezeTableName:true,
        timestamps:true
    })
    return Inventories
}

module.exports = initializeInventories;