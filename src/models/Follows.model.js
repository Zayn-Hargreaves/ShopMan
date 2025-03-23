const {DataTypes, Model} = require('@sequelize/core');

class Follows extends Model {}
const initializeFollows = async(sequelize)=>{

    Follows.init({
        UserId:{
            type:DataTypes.INTEGER,
            // references:{
            //     model:"Users",
            //     key:"id"
            // }
        },
        ShopId:{
            type:DataTypes.INTEGER,
            // references:{
            //     model:"Shops",
            //     key:"id"
            // }
        },
    },{
        sequelize,
        modelName:"Follows",
        tableName:"Follows",
        freezeTableName:true,
        timestamps:true
    })
    return Follows
}

module.exports = initializeFollows;