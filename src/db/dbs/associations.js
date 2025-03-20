const database = require('./db');
const sequelize = database.sequelize;
const Cart = require('../../models/Cart.model');
const Product = require('../../models/Products.model');
const User = require('../../models/User.model');
const Order = require('../../models/Order.model');
const OrderDetails = require('../../models/OrderDetails.model');
const CartDetails = require('../../models/CartDetails.model');
const Category = require('../../models/Category.model');
const Comment = require('../../models/Comment.model');
const Discounts = require('../../models/Discounts.model');
const DiscountsProducts = require('../../models/DiscountsProducts.model');
const Follows = require('../../models/Follows.model');
const Inventories = require('../../models/Inventories.model');
const Notifications = require('../../models/Notifications.model');
const Opt = require('../../models/Opt.model');
const Permissions = require('../../models/Permissions.model');
const Products = require('../../models/Products.model');
const Roles = require('../../models/Roles.model');
const RolesPermissions = require('../../models/RolesPermissions.model');
const Shop = require('../../models/Shop.model');
const WishLists = require('../../models/WishLists.model');
const Payment = require('../../models/Payment.model');
const PaymentMethod = require('../../models/PaymentMethod.model');
const Role = require('../../models/Roles.model');

const associations = async () => {
    try {
        await sequelize.authenticate();
        User.hasOne(Shop, {
            foreignKey: {
                name: 'UserId',
                allowNull: false
            }
        });
        Shop.belongsTo(User, {
            foreignKey: {
                name: 'UserId',
                allowNull: false
            }
        });
        User.hasMany(Notifications, {
            foreignKey: {
                name: 'UserId',
                allowNull: false
            }
        });
        Notifications.belongsTo(User, {
            foreignKey: {
                name: 'UserId',
                allowNull: false
            }
        });
        User.hasOne(Cart, {
            foreignKey: {
                name: 'UserId',
                allowNull: false
            }
        });
        Cart.belongsTo(User, {
            foreignKey: {
                name: 'UserId',
                allowNull: false
            }
        });
        User.hasMany(Comment, {
            foreignKey: {
                name: 'UserId',
                allowNull: false
            }
        });
        Comment.belongsTo(User, {
            foreignKey: {
                name: 'UserId',
                allowNull: false
            }
        });
        User.hasMany(Order,{
            foreignKey:{
                name:'UserId',
                allowNull:false
            }
        })
        Order.belongsTo(User,{
            foreignKey:{
                name:'UserId',
                allowNull:false
            }
        })
        User.hasMany(PaymentMethod,{
            foreignKey:{
                name:'UserId',
                allowNull:false
            }
        })
        PaymentMethod.belongsTo(User,{
            foreignKey:{
                name:'UserId',
                allowNull:false
            }
        })
        User.hasMany(Follows,{
            foreignKey:{
                name:'UserId',
                allowNull:false
            }
        })
        Follows.belongsTo(User,{
            foreignKey:{
                name:'UserId',
                allowNull:false
            }
        })
        User.hasMany(Opt,{
            foreignKey:{
                name:'UserId',
                allowNull:false
            }
        })
        Opt.belongsTo(User,{
            foreignKey:{
                name:'UserId',
                allowNull:false
            }
        })
        User.hasMany(WishLists,{
            foreignKey:{
                name:'UserId',
                allowNull:false
            }
        })
        WishLists.belongsTo(User,{
            foreignKey:{
                name:'UserId',
                allowNull:false
            }
        })
        Category.hasMany(Category,{
            as:'children',
            foreignKey:{
                name:'ParentId',
                onDelete:'CASCADE'
            },
            inverse:{
                as:'parent'
            }
        })
        Category.belongsTo(Category,{
            as:'parent',
            foreignKey:{
                name:'ParentId',
                onDelete:'CASCADE'
            }
        })
        Shop.hasMany(Follows,{
            foreignKey:{
                name:'ShopId',
                allowNull:false
            }
        })
        Follows.belongsTo(Shop,{
            foreignKey:{
                name:'ShopId',
                allowNull:false
            }
        })
        Shop.hasMany(Inventories,{
            foreignKey:{
                name:'ShopId',
                allowNull:false
            }
        })
        Inventories.belongsTo(Shop,{
            foreignKey:{
                name:'ShopId',
                allowNull:false
            }
        })
        Shop.hasMany(Notifications,{
            foreignKey:{
                name:'ShopId',
                allowNull:false
            }
        })
        Notifications.belongsTo(Shop,{
            foreignKey:{
                name:'ShopId',
                allowNull:false
            }
        })
        Shop.hasMany(Discounts,{
            foreignKey:{
                name:'ShopId',
                allowNull:false
            }
        })
        Discounts.belongsTo(Shop,{
            foreignKey:{
                name:'ShopId',
                allowNull:false
            }
        })
        Shop.hasMany(Products,{
            foreignKey:{
                name:'ShopId',
                allowNull:false
            }
        })
        Products.belongsTo(Shop,{
            foreignKey:{
                name:'ShopId',
                allowNull:false
            }
        })
        Role.hasMany(Shop,{
            foreignKey:{
                name:'RoleId',
                allowNull:false
            }
        })
        Shop.belongsTo(Role,{
            foreignKey:{
                name:'RoleId',
                allowNull:false
            }
        })
        Role.hasMany(RolesPermissions,{
            foreignKey:{
                name:'RoleId',
                allowNull:false
            }
        })
        RolesPermissions.belongsTo(Role,{
            foreignKey:{
                name:'RoleId',
                allowNull:false
            }
        })
        Permissions.hasMany(RolesPermissions,{
            foreignKey:{
                name:'PermissionsId',
                allowNull:false
            }
        })
        RolesPermissions.belongsTo(Permissions,{
            foreignKey:{
                name:'PermissionsId',
                allowNull:false
            }
        })
        Cart.hasMany(CartDetails,{
            foreignKey:{
                name:'CartId',
                allowNull:false
            }
        })
        CartDetails.belongsTo(Cart,{
            foreignKey:{
                name:'CartId',
                allowNull:false
            }
        })
        Order.hasMany(OrderDetails,{
            foreignKey:{
                name:'OrderId',
                allowNull:false
            }
        })
        OrderDetails.belongsTo(Order,{
            foreignKey:{
                name:'OrderId',
                allowNull:false
            }
        })
        Product.hasMany(CartDetails,{
            foreignKey:{
                name:'ProductId',
                allowNull:false
            }
        })
        CartDetails.belongsTo(Product,{
            foreignKey:{
                name:'ProductId',
                allowNull:false
            }
        })
        Product.hasMany(OrderDetails,{
            foreignKey:{
                name:'ProductId',
                allowNull:false
            }
        })
        OrderDetails.belongsTo(Product,{
            foreignKey:{
                name:'ProductId',
                allowNull:false
            }
        })
        Product.hasMany(DiscountsProducts,{
            foreignKey:{
                name:'ProductId',
                allowNull:false
            }
        })
        DiscountsProducts.belongsTo(Product,{
            foreignKey:{
                name:'ProductId',
                allowNull:false
            }
        })
        Product.hasMany(Comment,{
            foreignKey:{
                name:'ProductId',
                allowNull:false
            }
        })
        Comment.belongsTo(Product,{
            foreignKey:{
                name:'ProductId',
                allowNull:false
            }
        })
        Product.hasMany(Inventories,{
            foreignKey:{
                name:'ProductId',
                allowNull:false
            }
        })
        Inventories.belongsTo(Product,{
            foreignKey:{
                name:'ProductId',
                allowNull:false
            }
        })
        Product.hasMany(WishLists,{
            foreignKey:{
                name:'ProductId',
                allowNull:false
            }
        })
        WishLists.belongsTo(Product,{
            foreignKey:{
                name:'ProductId',
                allowNull:false
            }
        })
        Category.hasMany(Products,{
            foreignKey:{
                name:'CategoryId',
                allowNull:false
            }
        })
        Products.belongsTo(Category,{
            foreignKey:{
                name:'CategoryId',
                allowNull:false
            }
        })
        PaymentMethod.hasMany(Payment,{
            foreignKey:{
                name:'PaymentMethodId',
                allowNull:false
            }
        })
        Payment.belongsTo(PaymentMethod,{
            foreignKey:{
                name:'PaymentMethodId',
                allowNull:false
            }
        })
        await sequelize.sync();

    } catch (error) {
        console.log("association error::",error);
    }
}


module.exports = associations