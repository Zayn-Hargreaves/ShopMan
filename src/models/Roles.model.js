const {DataTypes, Model} = require('sequelize');

class Role extends Model {}
const initializeRole = async(sequelize)=>{

    Role.init({
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        role_name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        role_desc:{
            type: DataTypes.STRING,
        },
    }, {
        sequelize,
        modelName: "Roles",
        tableName : "Roles",
        freezeTableName: true,
        paranoid: true,
        timestamps: true,
    })
    return Role
}
module.exports = initializeRole;