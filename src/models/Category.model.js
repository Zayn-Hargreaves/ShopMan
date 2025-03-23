const {DataTypes, Model} = require("@sequelize/core");

class Category extends Model {}
const initializeCategory = async(sequelize)=>{
    Category.init({
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        category_name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        category_desc:{
            type: DataTypes.STRING,
        },
        category_status:{
            type: DataTypes.STRING,
            allowNull: false
        },
        category_thumb:{
            type:DataTypes.STRING
        },
        category_slug:{
            type: DataTypes.STRING,
            unique: true
        },
    }, {
        sequelize,
        modelName: "Categories",
        tableName:"Categories",
        freezeTableName: true,
        paranoid: true,
        timestamps: true
    })
    Category.addHook("beforeSave", (category) => {
        if(category.title){
            category.slug = slugify(category.title, {
                lower: true,
                strict: true,
                replacement: "-"
            });
        }
    });
    return Category
}
module.exports = initializeCategory;