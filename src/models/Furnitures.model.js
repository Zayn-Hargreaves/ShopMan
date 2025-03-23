const { DataTypes, Model } = require("@sequelize/core");

class Furniture extends Model {}

const initializeFurniture = async (sequelize)=>{
    Furniture.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            ProductId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
                // references: {
                //     model: "Products",
                //     key: "id",
                // },
            },
            manufacturer: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            model: {
                type: DataTypes.STRING,
            },
            color: {
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            modelName: "Furniture",
            tableName: "Furniture",
            freezeTableName: true,
            timestamps: true,
        }
    );

    return Furniture;
}

module.exports = initializeFurniture;