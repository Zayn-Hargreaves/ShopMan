const { DataTypes, Model } = require("@sequelize/core");

class RoleGrant extends Model {}

const  initializeRoleGrant= async(sequelize)=>{
    RoleGrant.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: "grant id",
            },
            RoleId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                // references: { model: "Roles", key: "id" },
                comment: "role id",
            },
            ResourceId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                // references: { model: "Resources", key: "rid" },
                comment: "resource id",
            },
            actions: {
                type: DataTypes.JSON, // Lưu mảng actions như ["read:any", "update:any"]
                allowNull: false,
                comment: "list of actions",
            },
            attributes: {
                type: DataTypes.STRING(255),
                allowNull: true,
                defaultValue: "",
                comment: "attributes allowed",
            },
        },
        {
            sequelize,
            modelName: "RoleGrant",
            tableName: "RoleGrants",
            freezeTableName: true,
            timestamps: false,
        }
    );

    return RoleGrant;
}

module.exports = initializeRoleGrant;