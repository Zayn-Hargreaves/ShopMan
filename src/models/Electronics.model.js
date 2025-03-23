const { DataTypes, Model } = require("@sequelize/core");

class Electronics extends Model {}
const initializeElectronics = async(sequelize)=>{
    Electronics.init(
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
            modelName: "Electronics",
            tableName: "Electronics",
            freezeTableName: true,
            timestamps: true,
        }
    );

    return Electronics;
}

module.exports = initializeElectronics;