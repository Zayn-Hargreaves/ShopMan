const { DataTypes, Model } = require("@sequelize/core");

class Product extends Model { }

const initializeProducts = async (sequelize) => {
    Product.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        desc: {
            type: DataTypes.STRING,
        },
        desc_plain:{
            type: DataTypes.STRING,
        },
        price: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        discount_percentage:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        thumb: {
            type: DataTypes.STRING,
        },
        attrs:{
            type: DataTypes.JSON,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "active"
        },
        slug: {
            type: DataTypes.STRING,
            unique: true
        },
        CategoryId: {
            type: DataTypes.INTEGER,

            allowNull: false
        },
        sort:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ShopId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        rating: {
            type: DataTypes.DECIMAL(2, 1),
            defaultValue: 4.5,
            validate: {
                min: 1,
                max: 5
            }
        },
        sale_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        has_variations: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

    }, {
        sequelize,
        modelName: "Products",
        tableName: "Products",
        freezeTableName: true,
        paranoid: true,
        timestamps: true,
    })
    Product.addHook("beforeCreate", (product) => {
        product.slug = product.name.toLowerCase().replace(/ /g, "-");
    })
return Product
}

module.exports = initializeProducts;