const {DataTypes, Model} = require("@sequelize/core");
const database = require("../db/dbs/db");
const sequelize = database.sequelize;
class Role extends Model {}
Role.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title:{
        type: DataTypes.STRING,
        allowNull: false
    },
    description:{
        type: DataTypes.STRING,
    },
}, {
    sequelize,
    modelName: "Role",
    tableName : "Role",
    freezeTableName: true,
    paranoid: true,
    timestamps: true,
})
module.exports = Role;