const { DataTypes, Model } = require('sequelize');

class Shop extends Model {}
const initializeShop = async (sequelize) => {
    Shop.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        balance: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 0
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'pending'
        },
        RolesId: {
            type: DataTypes.INTEGER
        },
        desc: {
            type: DataTypes.STRING
        },
        logo: {
            type: DataTypes.STRING
        },
        thumb: {
            type: DataTypes.STRING,
            allowNull:true
        },
        shopLocation: {
            type: DataTypes.STRING
        },
        rating: {
            type: DataTypes.DECIMAL(2, 1),
            defaultValue: 4.5,
            validate: { min: 1, max: 5 }
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        tableName: 'Shops',
        modelName: 'Shops',
        freezeTableName: true,
        paranoid: true,
        timestamps: true,
        indexes: [
            { fields: ['UserId'] },
            { fields: ['status'] },
            { fields: ['RolesId'] },
            { fields: ['UserId', 'status'] }
        ]
    });
    Shop.addHook('beforeCreate', (shop) => {
        shop.slug = shop.name.toLowerCase().replace(/ /g, '-');
    });
    return Shop;
};

module.exports = initializeShop;