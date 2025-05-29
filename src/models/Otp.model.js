const { DataTypes, Model } = require('sequelize');

class Otp extends Model {}
const initializeOtp = async (sequelize) => {
    Otp.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        otp_value: {
            type: DataTypes.STRING,
            allowNull: false
        },
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        expire: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Otps',
        tableName: 'Otps',
        freezeTableName: true,
        paranoid: true,
        timestamps: true,
        indexes: [
            { fields: ['UserId'] },
            { fields: ['otp_value'] },
            { fields: ['UserId', 'expire'] }
        ]
    });
    return Otp;
};

module.exports = initializeOtp;