const {DataTypes, Model} = require("@sequelize/core");
const database = require("../db/dbs/db");
const sequelize = database.sequelize;
const Roles = require("./Roles.model");
const Permissions = require("./Permissions.model");
class RolesPermissions extends Model {}
RolesPermissions.init({
    RoleId:{
        type:DataTypes.INTEGER,
        references:{
            model:Roles,
            key:"id"
        }
    },
    PermissionsId:{
        type:DataTypes.INTEGER,
        references:{
            model:Permissions,
            key:"id"
        }
    }
},{
    sequelize,
    modelName: "RolesPermissions",
    tableName: "RolesPermissions",
    freezeTableName: true,
})

module.exports = RolesPermissions;