const {DataTypes, Model} = require("@sequelize/core");
const database = require("../db/dbs/db");
const sequelize = database.sequelize;
class Permissions extends Model {}
Permissions.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    value:{
        type: DataTypes.STRING,
        allowNull: false
    },
    group:{
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize,
    modelName: "Permissions",
    tableName: "Permissions",
    freezeTableName: true,
    paranoid: true,
    timestamps: true,
})

module.exports = Permissions;