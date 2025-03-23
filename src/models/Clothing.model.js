const { DataTypes, Model } = require("@sequelize/core");

class Clothing extends Model {}

const initializeClothing = async (sequelize)=>{
    Clothing.init(
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
            brand: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            size: {
                type: DataTypes.STRING,
            },
            material: {
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            modelName: "Clothing",
            tableName: "Clothing",
            freezeTableName: true,
            timestamps: true,
        }
    );

    return Clothing;
}

module.exports = initializeClothing;