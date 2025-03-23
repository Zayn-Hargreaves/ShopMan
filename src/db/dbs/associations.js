const databasePromise = require("../dbs/db");
const initializeCart = require("../../models/Cart.model");
const initializeCartDetails = require("../../models/CartDetails.model");
const initializeCategory = require("../../models/Category.model");
const initializeClothing = require("../../models/Clothing.model");
const initializeComments = require("../../models/Comment.model");
const initializeDiscounts = require("../../models/Discounts.model");
const initializeDiscountsProducts = require("../../models/DiscountsProducts.model");
const initializeElectronics = require("../../models/Electronics.model");
const initializeFollows = require("../../models/Follows.model");
const initializeFurniture = require("../../models/Furnitures.model");
const initializeInventories = require("../../models/Inventories.model");
const initializeNotifications = require("../../models/Notifications.model");
const initializeOtp = require("../../models/Otp.model");
const initializeOrder = require("../../models/Order.model");
const initializeOrderDetails = require("../../models/OrderDetails.model");
const initializePayment = require("../../models/Payment.model");
const initializePaymentMethod = require("../../models/PaymentMethod.model");
const initializeProducts = require("../../models/Products.model");
const initializeProductVariation = require("../../models/ProductVariation.model");
const initializeShop = require("../../models/Shop.model");
const initializeUser = require("../../models/User.model");
const initializeWishLists = require("../../models/WishLists.model");
const initializeRole = require("../../models/Roles.model");
const initializeResource = require("../../models/Resource.model");
const initializeRoleGrant = require("../../models/RoleGrants.model");

const initializeModels = async () => {
    try {
        const database = await databasePromise;
        const sequelize = database.getSequelize();

        // Khởi tạo models
        const Cart = await initializeCart(sequelize);
        const CartDetails = await initializeCartDetails(sequelize);
        const Category = await initializeCategory(sequelize);
        const Clothing = await initializeClothing(sequelize);
        const Comment = await initializeComments(sequelize);
        const Discounts = await initializeDiscounts(sequelize);
        const DiscountsProducts = await initializeDiscountsProducts(sequelize);
        const Electronics = await initializeElectronics(sequelize);
        const Follows = await initializeFollows(sequelize);
        const Furnitures = await initializeFurniture(sequelize);
        const Inventories = await initializeInventories(sequelize);
        const Notifications = await initializeNotifications(sequelize);
        const Order = await initializeOrder(sequelize);
        const OrderDetails = await initializeOrderDetails(sequelize);
        const Otp = await initializeOtp(sequelize);
        const Payment = await initializePayment(sequelize);
        const PaymentMethod = await initializePaymentMethod(sequelize);
        const Products = await initializeProducts(sequelize);
        const ProductVariation = await initializeProductVariation(sequelize);
        const Resource = await initializeResource(sequelize);
        const RoleGrants = await initializeRoleGrant(sequelize);
        const Roles = await initializeRole(sequelize);
        const Shop = await initializeShop(sequelize);
        const User = await initializeUser(sequelize);
        const WishLists = await initializeWishLists(sequelize);

        // Quan hệ User - Cart (1-1)
        User.hasOne(Cart, { foreignKey: { name: "UserId" }, as: "cart" });
        Cart.belongsTo(User, { foreignKey: { name: "UserId" }, as: "user" });

        // Quan hệ Cart - CartDetails (1-n)
        Cart.hasMany(CartDetails, { foreignKey: { name: "CartId", allowNull: false }, as: "cartDetails" });
        CartDetails.belongsTo(Cart, { foreignKey: { name: "CartId", allowNull: false }, as: "cart" });

        // Quan hệ Products - CartDetails (1-n)
        Products.hasMany(CartDetails, { foreignKey: { name: "ProductId", allowNull: false }, as: "cartDetails" });
        CartDetails.belongsTo(Products, { foreignKey: { name: "ProductId", allowNull: false }, as: "product" });

        // Quan hệ Category tự tham chiếu (1-n)
        Category.hasMany(Category, {
            as: "children",
            foreignKey: { name: "ParentId", onDelete: "CASCADE" }, // Đặt trong foreignKey
            inverse: { as: "parent" }
        });
        Category.belongsTo(Category, {
            as: "parent",
            foreignKey: { name: "ParentId", onDelete: "CASCADE" } // Đặt trong foreignKey
        });

        // Quan hệ Products - Clothing (1-1)
        Products.hasOne(Clothing, { foreignKey: { name: "ProductId", allowNull: false }, as: "clothing" });
        Clothing.belongsTo(Products, { foreignKey: { name: "ProductId", allowNull: false }, as: "product" });

        // Quan hệ User - Comment (1-n)
        User.hasMany(Comment, { foreignKey: { name: "UserId", allowNull: false }, as: "comments" });
        Comment.belongsTo(User, { foreignKey: { name: "UserId", allowNull: false }, as: "user" });

        // Quan hệ Products - Comment (1-n)
        Products.hasMany(Comment, { foreignKey: { name: "ProductId", allowNull: false }, as: "comments" });
        Comment.belongsTo(Products, { foreignKey: { name: "ProductId", allowNull: false }, as: "product" });

        // Quan hệ Shop - Discounts (1-n)
        Shop.hasMany(Discounts, { foreignKey: { name: "ShopId" }, as: "discounts" });
        Discounts.belongsTo(Shop, { foreignKey: { name: "ShopId" }, as: "shop" });

        // Quan hệ Discounts - DiscountsProducts (1-n)
        Discounts.hasMany(DiscountsProducts, { foreignKey: { name: "DiscountId" }, as: "discountProducts" });
        DiscountsProducts.belongsTo(Discounts, { foreignKey: { name: "DiscountId" }, as: "discount" });

        // Quan hệ Products - DiscountsProducts (1-n)
        Products.hasMany(DiscountsProducts, { foreignKey: { name: "ProductId" }, as: "discountProducts" });
        DiscountsProducts.belongsTo(Products, { foreignKey: { name: "ProductId" }, as: "product" });

        // Quan hệ Products - Electronics (1-1)
        Products.hasOne(Electronics, { foreignKey: { name: "ProductId" }, as: "electronics" });
        Electronics.belongsTo(Products, { foreignKey: { name: "ProductId" }, as: "product" });

        // Quan hệ User - Follows (1-n)
        User.hasMany(Follows, { foreignKey: { name: "UserId" }, as: "follows" });
        Follows.belongsTo(User, { foreignKey: { name: "UserId" }, as: "user" });

        // Quan hệ Shop - Follows (1-n)
        Shop.hasMany(Follows, { foreignKey: { name: "ShopId" }, as: "follows" });
        Follows.belongsTo(Shop, { foreignKey: { name: "ShopId" }, as: "shop" });

        // Quan hệ Products - Furnitures (1-1)
        Products.hasOne(Furnitures, { foreignKey: { name: "ProductId" }, as: "furnitures" });
        Furnitures.belongsTo(Products, { foreignKey: { name: "ProductId" }, as: "product" });

        // Quan hệ Products - Inventories (1-n)
        Products.hasMany(Inventories, { foreignKey: { name: "ProductId" }, as: "inventories" });
        Inventories.belongsTo(Products, { foreignKey: { name: "ProductId" }, as: "product" });

        // Quan hệ Shop - Inventories (1-n)
        Shop.hasMany(Inventories, { foreignKey: { name: "ShopId" }, as: "inventories" });
        Inventories.belongsTo(Shop, { foreignKey: { name: "ShopId" }, as: "shop" });

        // Quan hệ Shop - Notifications (1-n)
        Shop.hasMany(Notifications, { foreignKey: { name: "ShopId" }, as: "notifications" });
        Notifications.belongsTo(Shop, { foreignKey: { name: "ShopId" }, as: "shop" });

        // Quan hệ User - Notifications (1-n)
        User.hasMany(Notifications, { foreignKey: { name: "UserId" }, as: "notifications" });
        Notifications.belongsTo(User, { foreignKey: { name: "UserId" }, as: "user" });

        // Quan hệ User - Order (1-n)
        User.hasMany(Order, { foreignKey: { name: "UserId" }, as: "orders" });
        Order.belongsTo(User, { foreignKey: { name: "UserId" }, as: "user" });

        // Quan hệ Order - OrderDetails (1-n)
        Order.hasMany(OrderDetails, { foreignKey: { name: "OrderId" }, as: "orderDetails" });
        OrderDetails.belongsTo(Order, { foreignKey: { name: "OrderId" }, as: "order" });

        // Quan hệ Products - OrderDetails (1-n)
        Products.hasMany(OrderDetails, { foreignKey: { name: "ProductId" }, as: "orderDetails" });
        OrderDetails.belongsTo(Products, { foreignKey: { name: "ProductId" }, as: "product" });

        // Quan hệ User - Otp (1-n)
        User.hasMany(Otp, { foreignKey: { name: "UserId" }, as: "otps" });
        Otp.belongsTo(User, { foreignKey: { name: "UserId" }, as: "user" });

        // Quan hệ User - Payment (1-n)
        User.hasMany(Payment, { foreignKey: { name: "UserId" }, as: "payments" });
        Payment.belongsTo(User, { foreignKey: { name: "UserId" }, as: "user" });

        // Quan hệ Order - Payment (1-n)
        Order.hasMany(Payment, { foreignKey: { name: "OrderId" }, as: "payments" });
        Payment.belongsTo(Order, { foreignKey: { name: "OrderId" }, as: "order" });

        // Quan hệ PaymentMethod - Payment (1-n)
        PaymentMethod.hasMany(Payment, { foreignKey: { name: "PaymentMethodId" }, as: "payments" });
        Payment.belongsTo(PaymentMethod, { foreignKey: { name: "PaymentMethodId" }, as: "paymentMethod" });

        // Quan hệ Category - Products (1-n)
        Category.hasMany(Products, { foreignKey: { name: "CategoryId" }, as: "products" });
        Products.belongsTo(Category, { foreignKey: { name: "CategoryId" }, as: "category" });

        // Quan hệ Shop - Products (1-n)
        Shop.hasMany(Products, { foreignKey: { name: "ShopId" }, as: "products" });
        Products.belongsTo(Shop, { foreignKey: { name: "ShopId" }, as: "shop" });

        // Quan hệ Products - ProductVariation (1-n)
        Products.hasMany(ProductVariation, { foreignKey: { name: "ProductId" }, as: "variations" });
        ProductVariation.belongsTo(Products, { foreignKey: { name: "ProductId" }, as: "product" });

        // Quan hệ Roles - RoleGrants (1-n)
        Roles.hasMany(RoleGrants, { foreignKey: { name: "RoleId" }, as: "roleGrants" });
        RoleGrants.belongsTo(Roles, { foreignKey: { name: "RoleId" }, as: "role" });

        // Quan hệ Resource - RoleGrants (1-n)
        Resource.hasMany(RoleGrants, { foreignKey: { name: "ResourceId" }, as: "roleGrants" });
        RoleGrants.belongsTo(Resource, { foreignKey: { name: "ResourceId" }, as: "resource" });

        // Quan hệ User - Shop (1-1)
        User.hasOne(Shop, { foreignKey: { name: "UserId" }, as: "shop" });
        Shop.belongsTo(User, { foreignKey: { name: "UserId" }, as: "user" });

        // Quan hệ Roles - Shop (1-n)
        Roles.hasMany(Shop, { foreignKey: { name: "RoleId" }, as: "shops" });
        Shop.belongsTo(Roles, { foreignKey: { name: "RoleId" }, as: "role" });

        // Quan hệ User - WishLists (1-n)
        User.hasMany(WishLists, { foreignKey: { name: "UserId" }, as: "wishlists" });
        WishLists.belongsTo(User, { foreignKey: { name: "UserId" }, as: "user" });

        // Quan hệ Products - WishLists (1-n)
        Products.hasMany(WishLists, { foreignKey: { name: "ProductId" }, as: "wishlists" });
        WishLists.belongsTo(Products, { foreignKey: { name: "ProductId" }, as: "product" });

        // Đồng bộ database
        await sequelize.sync({ force: false }); // force: false để giữ dữ liệu hiện có

        return {
            Cart, CartDetails, Category, Clothing, Comment, Discounts, DiscountsProducts,
            Electronics, Follows, Furnitures, Inventories, Notifications, Order, OrderDetails,
            Otp, Payment, PaymentMethod, Products, ProductVariation, Resource, RoleGrants,
            Roles, Shop, User, WishLists
        };
    } catch (error) {
        console.error("Error initializing models:", error);
        throw error;
    }
};

module.exports = initializeModels();