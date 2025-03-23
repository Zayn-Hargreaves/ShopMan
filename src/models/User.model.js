const {DataTypes, Model} = require("@sequelize/core");

class User extends Model {}
const initializeUser = async(sequelize)=>{
    User.init({
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        user_email:{
            type: DataTypes.STRING,
            allowNull: false
        },
        user_password:{
            type: DataTypes.STRING,
        },
        user_phone:{
            type: DataTypes.STRING,
        },
        user_avatar:{
            type: DataTypes.STRING,
        },
        user_status:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue:"active"
        },
        user_address:{
            type: DataTypes.STRING,
        },
    }, {
        sequelize,
        modelName: "Users",
        tableName: "Users",
        freezeTableName: true,
        paranoid: true,
        timestamps: true,
    })
    return User
}

module.exports = initializeUser;