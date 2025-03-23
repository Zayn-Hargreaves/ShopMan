const {DataTypes, Model} = require("@sequelize/core");

class Otp extends Model {}
const initializeOtp = async(sequelize)=>{

    Otp.init({
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        otp_value:{
            type: DataTypes.STRING,
            allowNull: false
        },
        UserId:{
            type: DataTypes.INTEGER,
            // references:{
            //     model:"Users",
            //     key:"id"
            // },
            allowNull: false
        },
    }, {
        sequelize,
        modelName: "Otps",
        tableName : "Otps",
        freezeTableName: true,
        paranoid: true,
        timestamps: true,
    })
    return Otp
}

module.exports = initializeOtp;