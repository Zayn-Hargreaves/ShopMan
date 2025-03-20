const {DataTypes, Model} = require("@sequelize/core");
const database = require("../db/dbs/db");
const sequelize = database.sequelize;
class Category extends Model {
}
Category.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title:{
        type: DataTypes.STRING,
        allowNull: false
    },
    description:{
        type: DataTypes.STRING,
    },
    status:{
        type: DataTypes.STRING,
        allowNull: false
    },
    image:{
        type:DataTypes.STRING
    },
    slug:{
        type: DataTypes.STRING,
        unique: true
    },
}, {
    sequelize,
    modelName: "Category",
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
module.exports = Category;