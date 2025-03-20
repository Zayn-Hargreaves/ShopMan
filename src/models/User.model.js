const {DataTypes, Model} = require("@sequelize/core");
const database = require("../db/dbs/db");
const sequelize = database.sequelize;
class User extends Model {}
User.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false
    },
    password:{
        type: DataTypes.STRING,
    },
    phone:{
        type: DataTypes.STRING,
    },
    avatar:{
        type: DataTypes.STRING,
    },
    status:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:"active"
    },
    address:{
        type: DataTypes.STRING,
    },
}, {
    sequelize,
    modelName: "User",
    tableName: "User",
    freezeTableName: true,
    paranoid: true,
    timestamps: true,
})

module.exports = User;