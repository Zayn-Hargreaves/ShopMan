const {DataTypes, Model} = require("@sequelize/core");
const database = require("../db/dbs/db");
const sequelize = database.sequelize;
const User = require("./User.model");
class Opt extends Model {}
Opt.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    value:{
        type: DataTypes.STRING,
        allowNull: false
    },
    UserId:{
        type: DataTypes.INTEGER,
        references:{
            model:User,
            key:"id"
        },
        allowNull: false
    },
}, {
    sequelize,
    modelName: "Opt",
    tableName : "Opt",
    freezeTableName: true,
    paranoid: true,
    timestamps: true,
})

module.exports = Opt;