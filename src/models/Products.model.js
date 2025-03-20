const {DataTypes, Model} = require("@sequelize/core");
const database = require("../db/dbs/db");
const sequelize = database.sequelize;
const Shop = require("./Shop.model");
const Category = require("./Category.model");
class Product extends Model {}
Product.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    description:{
        type: DataTypes.STRING,
    },
    price:{
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    quantity:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    image:{
        type: DataTypes.STRING,
    },
    type:{
        type: DataTypes.STRING,
        allowNull: false
    },
    status:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:"active"
    },
    slug:{
        type: DataTypes.STRING,
        unique: true
    },
    CategoryId:{
        type: DataTypes.INTEGER,
        references:{
            model:Category,
            key:"id"
        },
        allowNull: false
    },
    ShopId:{
        type: DataTypes.INTEGER,
        references:{
            model:Shop,
            key:"id"
        },
        allowNull: false
    },
}, {
    sequelize,
    modelName: "Product",
    tableName : "Product",
    freezeTableName: true,
    paranoid: true,
    timestamps: true,
})
Product.addHook("beforeCreate", (product) => {
    product.slug = product.name.toLowerCase().replace(/ /g, "-");
})

module.exports = Product;