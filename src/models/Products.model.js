const {DataTypes, Model} = require("@sequelize/core");

class Product extends Model {}

const initializeProducts = async(sequelize)=>{
    Product.init({
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        product_name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        product_desc:{
            type: DataTypes.STRING,
        },
        product_price:{
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        product_quantity:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        product_thumb:{
            type: DataTypes.STRING,
        },
        product_type:{
            type: DataTypes.STRING,
            allowNull: false
        },
        product_status:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue:"active"
        },
        product_slug:{
            type: DataTypes.STRING,
            unique: true
        },
        CategoryId:{
            type: DataTypes.INTEGER,
            // references:{
            //     model:"Categories",
            //     key:"id"
            // },
            allowNull: false
        },
        ShopId:{
            type: DataTypes.INTEGER,
            // references:{
            //     model:"Shops",
            //     key:"id"
            // },
            allowNull: false
        },
        product_rating:{
            type:DataTypes.DECIMAL(2,1),
            defaultValue:4.5,
            validate:{
                min:1,
                max:5
            }
        }
    }, {
        sequelize,
        modelName: "Products",
        tableName : "Products",
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