const {DataTypes, Model} = require("@sequelize/core");

class Notifications extends Model {}
const initializeNotifications = async(sequelize)=>{
    Notifications.init({
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        noti_type:{
            type: DataTypes.STRING,
            allowNull: false
        },
        noti_option:{
            type: DataTypes.STRING,
            allowNull: false
        },
        noti_content:{
            type: DataTypes.STRING,
            allowNull: false
        },
        ShopId:{
            type: DataTypes.INTEGER,
            // references:{
            //     model:"Shops",
            //     key:"id"
            // }
        },
        UserId:{
            type: DataTypes.INTEGER,
            // references:{
            //     model:"Users",
            //     key:"id"
            // }
        },
    },{
        sequelize,
        tableName:"Notifications",
        modelName:"Notifications",
        freezeTableName:true,
        timestamps:true
    })
    return Notifications
}

module.exports = initializeNotifications;