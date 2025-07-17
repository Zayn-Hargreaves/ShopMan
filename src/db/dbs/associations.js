const databasePromise = require("../dbs/db");
const initializeCart = require("../../models/Cart.model");
const initializeCartDetails = require("../../models/CartDetails.model");
const initializeCategory = require("../../models/Category.model");
const initializeComments = require("../../models/Comment.model");
const initializeDiscounts = require("../../models/Discounts.model");
const initializeDiscountsProducts = require("../../models/DiscountsProducts.model");
const initializeFollows = require("../../models/Follows.model");
const initializeInventories = require("../../models/Inventories.model");
const initializeNotifications = require("../../models/Notifications.model");
const initializeOtp = require("../../models/Otp.model");
const initializeOrder = require("../../models/Order.model");
const initializeOrderDetails = require("../../models/OrderDetails.model");
const initializePayment = require("../../models/Payment.model");
const initializePaymentMethod = require("../../models/PaymentMethod.model");
const initializeProducts = require("../../models/Products.model");
const initializeShop = require("../../models/Shop.model");
const initializeUser = require("../../models/User.model");
const initializeWishLists = require("../../models/WishLists.model");
const initializeRole = require("../../models/Roles.model");
const initializeResource = require("../../models/Resource.model");
const initializeRoleGrant = require("../../models/RoleGrants.model");
const initializeBanner = require("../../models/Banner.model")
const inittialPartner = require("../../models/Partner.model")
const inittialAddress = require("../../models/Address.model")
const initializeSku = require("../../models/Sku.model")
const initializeSkuAttr = require("../../models/SkuAttr.model")
const initializeSkuSpecs = require("../../models/SkuSpecs.model")
const initializeSpuToSku = require("../../models/SpuToSku.model")
const initializeCampaignShop = require("../../models/CampaignShop.model")
const initializeCampaign = require("../../models/Campaign.model")
const initializeShopUserRole = require('../../models/ShopUserRole.model');
const initializeModels = async () => {
    try {
        const database = await databasePromise();
        const sequelize = database.getSequelize();

        // Khởi tạo models
        const ShopUserRole = await initializeShopUserRole(sequelize)
        const Cart = await initializeCart(sequelize);
        const CartDetails = await initializeCartDetails(sequelize);
        const Category = await initializeCategory(sequelize);
        const Comment = await initializeComments(sequelize);
        const Discounts = await initializeDiscounts(sequelize);
        const DiscountsProducts = await initializeDiscountsProducts(sequelize);
        const Follows = await initializeFollows(sequelize);
        const Inventories = await initializeInventories(sequelize);
        const Notifications = await initializeNotifications(sequelize);
        const Order = await initializeOrder(sequelize);
        const OrderDetails = await initializeOrderDetails(sequelize);
        const Otp = await initializeOtp(sequelize);
        const Payment = await initializePayment(sequelize);
        const PaymentMethod = await initializePaymentMethod(sequelize);
        const Products = await initializeProducts(sequelize);
        const Resource = await initializeResource(sequelize);
        const RoleGrants = await initializeRoleGrant(sequelize);
        const Roles = await initializeRole(sequelize);
        const Shop = await initializeShop(sequelize);
        const User = await initializeUser(sequelize);
        const Wishlists = await initializeWishLists(sequelize);
        const Banner = await initializeBanner(sequelize);
        const Partner = await inittialPartner(sequelize)
        const Address = await inittialAddress(sequelize)
        const Sku = await initializeSku(sequelize)
        const SkuAttr = await initializeSkuAttr(sequelize)
        const SkuSpecs = await initializeSkuSpecs(sequelize)
        const SpuToSku = await initializeSpuToSku(sequelize)
        const Campaign = await initializeCampaign(sequelize)
        const CampaignShop = await initializeCampaignShop(sequelize)


        // Quan hệ User - Cart (1-1)
        User.hasOne(Cart, { foreignKey: { name: "UserId", onDelete: 'CASCADE' }, as: "cart" });
        Cart.belongsTo(User, { foreignKey: { name: "UserId", onDelete: 'CASCADE' }, as: "user" });

        // Quan hệ Cart - CartDetails (1-n)
        Cart.hasMany(CartDetails, { foreignKey: { name: "CartId", allowNull: false, onDelete: 'CASCADE' }, as: "cartDetails" });
        CartDetails.belongsTo(Cart, { foreignKey: { name: "CartId", allowNull: false, onDelete: 'CASCADE' }, as: "cart" });

        // Quan hệ Products - CartDetails (1-n)
        Products.hasMany(CartDetails, { foreignKey: { name: "ProductId", allowNull: false, onDelete: 'CASCADE' }, as: "cartDetails" });
        CartDetails.belongsTo(Products, { foreignKey: { name: "ProductId", allowNull: false, onDelete: 'CASCADE' }, as: "product" });

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
        // Một bình luận có thể có nhiều bình luận con
        Comment.hasMany(Comment, {
            as: 'children',
            foreignKey: 'ParentId',
            onDelete: 'CASCADE',
            hooks: true
        });

        // Một bình luận con thuộc về 1 cha
        Comment.belongsTo(Comment, {
            as: 'parent',
            foreignKey: 'ParentId',
            onDelete: 'CASCADE',
            hooks: true
        });

        // Quan hệ User - Comment (1-n)
        User.hasMany(Comment, { foreignKey: { name: "UserId", allowNull: false, onDelete: 'CASCADE' }, as: "comments" });
        Comment.belongsTo(User, { foreignKey: { name: "UserId", allowNull: false, onDelete: 'CASCADE' }, as: "user" });

        // Quan hệ Products - Comment (1-n)
        Products.hasMany(Comment, { foreignKey: { name: "ProductId", allowNull: false, onDelete: 'CASCADE' }, as: "comments" });
        Comment.belongsTo(Products, { foreignKey: { name: "ProductId", allowNull: false, onDelete: 'CASCADE' }, as: "product" });

        // Quan hệ Shop - Discounts (1-n)
        Shop.hasMany(Discounts, { foreignKey: { name: "ShopId", onDelete: 'CASCADE' }, as: "discounts" });
        Discounts.belongsTo(Shop, { foreignKey: { name: "ShopId", onDelete: 'CASCADE' }, as: "shop" });

        // Quan hệ Discounts - DiscountsProducts (1-n)
        Products.belongsToMany(Discounts, {
            through: DiscountsProducts,
            foreignKey: 'ProductId',
            otherKey: 'DiscountId',
            as: 'discounts',
            onDelete: 'CASCADE'
        });

        Discounts.belongsToMany(Products, {
            through: DiscountsProducts,
            foreignKey: 'DiscountId',
            otherKey: 'ProductId',
            as: 'products',
            onDelete: 'CASCADE'
        });

        Discounts.hasMany(DiscountsProducts, {
            foreignKey: 'DiscountId',
            as: 'DiscountsProducts',
            onDelete: 'CASCADE'
        });
        DiscountsProducts.belongsTo(Discounts, {
            foreignKey: 'DiscountId',
            onDelete: 'CASCADE'
        });

        // Ngược lại nếu cần lấy Product từ DiscountsProducts
        Products.hasMany(DiscountsProducts, {
            foreignKey: 'ProductId',
            as: 'DiscountsProducts',
            onDelete: 'CASCADE'
        });
        DiscountsProducts.belongsTo(Products, {
            foreignKey: 'ProductId',
            onDelete: 'CASCADE'
        });

        // Quan hệ User - Follows (1-n)
        User.hasMany(Follows, { foreignKey: { name: "UserId", onDelete: 'CASCADE' }, as: "follows" });
        Follows.belongsTo(User, { foreignKey: { name: "UserId", onDelete: 'CASCADE' }, as: "user" });

        // Quan hệ Shop - Follows (1-n)
        Shop.hasMany(Follows, { foreignKey: { name: "ShopId", onDelete: 'CASCADE' }, as: "follows" });
        Follows.belongsTo(Shop, { foreignKey: { name: "ShopId", onDelete: 'CASCADE' }, as: "shop" });

        // Quan hệ Products - Inventories (1-n)
        Sku.hasMany(Inventories, { foreignKey: { name: "SkuId", onDelete: 'CASCADE' }, as: "inventories" });
        Inventories.belongsTo(Sku, { foreignKey: { name: "SkuId", onDelete: 'CASCADE' }, as: "sku" });

        // Quan hệ Shop - Inventories (1-n)
        Shop.hasMany(Inventories, { foreignKey: { name: "ShopId", onDelete: 'CASCADE' }, as: "inventories" });
        Inventories.belongsTo(Shop, { foreignKey: { name: "ShopId", onDelete: 'CASCADE' }, as: "shop" });

        // Quan hệ Shop - Notifications (1-n)
        Shop.hasMany(Notifications, { foreignKey: { name: "ShopId", onDelete: 'CASCADE' }, as: "notifications" });
        Notifications.belongsTo(Shop, { foreignKey: { name: "ShopId", onDelete: 'CASCADE' }, as: "shop" });

        // Quan hệ User - Notifications (1-n)
        User.hasMany(Notifications, { foreignKey: { name: "UserId", onDelete: 'CASCADE' }, as: "notifications" });
        Notifications.belongsTo(User, { foreignKey: { name: "UserId", onDelete: 'CASCADE' }, as: "user" });

        // Quan hệ User - Order (1-n)
        User.hasMany(Order, { foreignKey: { name: "UserId", onDelete: 'CASCADE' }, as: "orders" });
        Order.belongsTo(User, { foreignKey: { name: "UserId", onDelete: 'CASCADE' }, as: "user" });

        // Quan hệ Order - OrderDetails (1-n)
        Order.hasMany(OrderDetails, { foreignKey: { name: "OrderId", onDelete: 'CASCADE' }, as: "orderDetails" });
        OrderDetails.belongsTo(Order, { foreignKey: { name: "OrderId", onDelete: 'CASCADE' }, as: "order" });

        // Quan hệ Products - OrderDetails (1-n)
        Products.hasMany(OrderDetails, { foreignKey: { name: "ProductId", onDelete: 'CASCADE' }, as: "orderDetails" });
        OrderDetails.belongsTo(Products, { foreignKey: { name: "ProductId", onDelete: 'CASCADE' }, as: "product" });

        // Quan hệ User - Otp (1-n)
        User.hasMany(Otp, { foreignKey: { name: "UserId", onDelete: 'CASCADE' }, as: "otps" });
        Otp.belongsTo(User, { foreignKey: { name: "UserId", onDelete: 'CASCADE' }, as: "user" });

        // Quan hệ User - Payment (1-n)
        User.hasMany(Payment, { foreignKey: { name: "UserId", onDelete: 'CASCADE' }, as: "payments" });
        Payment.belongsTo(User, { foreignKey: { name: "UserId", onDelete: 'CASCADE' }, as: "user" });

        // Quan hệ Order - Payment (1-n)
        Order.hasMany(Payment, { foreignKey: { name: "OrderId", onDelete: 'CASCADE' }, as: "payments" });
        Payment.belongsTo(Order, { foreignKey: { name: "OrderId", onDelete: 'CASCADE' }, as: "order" });

        // Quan hệ PaymentMethod - Payment (1-n)
        PaymentMethod.hasMany(Payment, { foreignKey: { name: "PaymentMethodId", onDelete: 'CASCADE' }, as: "payments" });
        Payment.belongsTo(PaymentMethod, { foreignKey: { name: "PaymentMethodId", onDelete: 'CASCADE' }, as: "paymentMethod" });

        // Quan hệ Category - Products (1-n)
        Category.hasMany(Products, { foreignKey: { name: "CategoryId", onDelete: 'CASCADE' }, as: "products" });
        Products.belongsTo(Category, { foreignKey: { name: "CategoryId", onDelete: 'CASCADE' }, as: "category" });

        // Quan hệ Shop - Products (1-n)
        Shop.hasMany(Products, { foreignKey: { name: "ShopId", onDelete: 'CASCADE' }, as: "products" });
        Products.belongsTo(Shop, { foreignKey: { name: "ShopId", onDelete: 'CASCADE' }, as: "shop" });

        // Quan hệ Products - ProductVariation (1-n)
        Roles.hasMany(RoleGrants, { foreignKey: { name: "RoleId", onDelete: 'CASCADE' }, as: "roleGrants" });
        RoleGrants.belongsTo(Roles, { foreignKey: { name: "RoleId", onDelete: 'CASCADE' }, as: "role" });

        // Quan hệ Resource - RoleGrants (1-n)
        Resource.hasMany(RoleGrants, { foreignKey: { name: "ResourceId", onDelete: 'CASCADE' }, as: "roleGrants" });
        RoleGrants.belongsTo(Resource, { foreignKey: { name: "ResourceId", onDelete: 'CASCADE' }, as: "resource" });

        // Quan hệ User - Shop (1-1)
        User.hasOne(Shop, { foreignKey: { name: "UserId", onDelete: 'CASCADE' }, as: "shop" });
        Shop.belongsTo(User, { foreignKey: { name: "UserId", onDelete: 'CASCADE' }, as: "user" });

        // Quan hệ Roles - Shop (1-n)
        Roles.hasMany(Shop, { foreignKey: { name: "RolesId", onDelete: 'CASCADE' }, as: "shops" });
        Shop.belongsTo(Roles, { foreignKey: { name: "RolesId", onDelete: 'CASCADE' }, as: "role" });

        // Quan hệ User - WishLists (1-n)
        User.hasMany(Wishlists, { foreignKey: { name: "UserId", onDelete: 'CASCADE' }, as: "wishlists" });
        Wishlists.belongsTo(User, { foreignKey: { name: "UserId" }, as: "user" });

        // Quan hệ Products - WishLists (1-n)
        Products.hasMany(Wishlists, { foreignKey: { name: "ProductId", onDelete: 'CASCADE' }, as: "wishlists" });
        Wishlists.belongsTo(Products, { foreignKey: { name: "ProductId", onDelete: 'CASCADE' }, as: "product" });

        Shop.hasMany(Banner, { foreignKey: { name: "ShopId", onDelete: 'CASCADE' }, as: 'banners' })
        Banner.belongsTo(Shop, { foreignKey: { name: 'ShopId', onDelete: 'CASCADE' }, as: 'shops' })

        Partner.hasMany(Banner, { foreignKey: { name: "PartnerId", onDelete: 'CASCADE' }, as: 'banners' })
        Banner.belongsTo(Partner, { foreignKey: { name: "PartnerId", onDelete: 'CASCADE' }, as: 'partners' })

        User.hasMany(Address, { foreignKey: 'UserId', as: "address", onDelete: 'CASCADE' })
        Address.belongsTo(User, { foreignKey: "UserId", as: "users", onDelete: 'CASCADE' })

        Products.hasMany(Sku, { foreignKey: 'ProductId', onDelete: 'CASCADE', sourceKey: 'id', as: 'Sku', foreignKeyConstraints: false })
        Sku.belongsTo(Products, { foreignKey: 'ProductId', onDelete: 'CASCADE', targetKey: 'id', as: 'Product', foreignKeyConstraints: false })

        Sku.hasMany(SpuToSku, { foreignKey: 'sku_no', onDelete: 'CASCADE', sourceKey: 'sku_no', foreignKeyConstraints: false })
        SpuToSku.belongsTo(Sku, { foreignKey: 'sku_no', onDelete: 'CASCADE', targetKey: 'sku_no', as: 'Sku', foreignKeyConstraints: false })

        Sku.hasOne(SkuAttr, { foreignKey: 'sku_no', onDelete: 'CASCADE', sourceKey: 'sku_no', as: 'SkuAttr', foreignKeyConstraints: false })
        SkuAttr.belongsTo(Sku, { foreignKey: 'sku_no', onDelete: 'CASCADE', targetKey: 'sku_no', foreignKeyConstraints: false })

        Sku.hasOne(SkuSpecs, { foreignKey: 'SkuId', onDelete: 'CASCADE', sourceKey: 'id', as: 'SkuSpecs', foreignKeyConstraints: false });
        SkuSpecs.belongsTo(Sku, { foreignKey: 'SkuId', onDelete: 'CASCADE', targetKey: 'id', foreignKeyConstraints: false });

        Campaign.hasMany(Discounts, { foreignKey: { name: 'CampaignId', onDelete: 'CASCADE', }, as: 'discount' })
        Discounts.belongsTo(Campaign, { foreignKey: { name: 'CampaignId', onDelete: 'CASCADE', }, as: 'campaign' })

        Shop.hasMany(OrderDetails, { foreignKey: { name: "ShopId", onDelete: 'CASCADE' }, as: "shop" })
        OrderDetails.belongsTo(Shop, { foreignKey: { name: "ShopId", onDelete: 'CASCADE' }, as: "Shop" })
        CartDetails.belongsTo(Sku, {
            foreignKey: 'sku_no',
            targetKey: 'sku_no',
            as: 'Sku',
            constraints: false,
            foreignKeyConstraints: false,
        });

        Sku.hasMany(CartDetails, {
            foreignKey: 'sku_no',
            sourceKey: 'sku_no',
            as: 'CartItems',
            constraints: false,
            foreignKeyConstraints: false
        });

        Address.hasMany(Order, { foreignKey: { name: "AddressId", as: "address", onDelete: 'CASCADE' } })
        Order.belongsTo(Address, { foreignKey: { name: "AddressId", as: 'address' } })

        PaymentMethod.hasMany(Order, { foreignKey: { name: "PaymentMethodId", onDelete: 'CASCADE' }, as: 'order' })
        Order.belongsTo(PaymentMethod, { foreignKey: { name: "PaymentMethodId", onDelete: 'CASCADE' }, as: 'paymentMethod' })
        OrderDetails.belongsTo(Sku, {
            foreignKey: 'sku_no',
            targetKey: 'sku_no',
            as: 'Sku',
            constraints: false,
            onDelete: 'CASCADE',
            foreignKeyConstraints: false
        });

        Sku.hasMany(OrderDetails, {
            foreignKey: 'sku_no',
            sourceKey: 'sku_no',
            as: 'OrderDetails',
            constraints: false,
            onDelete: 'CASCADE',
            foreignKeyConstraints: false
        });

        User.hasMany(ShopUserRole, { foreignKey: { name: 'UserId', onDelete: 'CASCADE', }, as: 'shopUserRole' })
        ShopUserRole.belongsTo(User, { foreignKey: { name: "UserId", onDelete: 'CASCADE' }, as: "user" })

        Shop.hasMany(ShopUserRole, { foreignKey: { name: "ShopId", onDelete: 'CASCADE' }, as: "shopUserRole" })
        ShopUserRole.belongsTo(Shop, { foreignKey: { name: "ShopId", onDelete: 'CASCADE' }, as: "shop" })

        Roles.hasMany(ShopUserRole, { foreignKey: { name: "RoleId", onDelete: 'CASCADE' }, as: "shopUserRole" })
        ShopUserRole.belongsTo(Roles, { foreignKey: { name: "RoleId", onDelete: 'CASCADE' }, as: "role" })

        // Campaign có nhiều Shop qua CampaignShop
        Campaign.belongsToMany(Shop, {
            through: CampaignShop,
            foreignKey: 'CampaignId',
            otherKey: 'ShopId',
            as: 'shops',           // CHÚ Ý: Đặt tên khác nhau, dùng số nhiều
            onDelete: 'CASCADE'
        });

        // Shop có nhiều Campaign qua CampaignShop
        Shop.belongsToMany(Campaign, {
            through: CampaignShop,
            foreignKey: 'ShopId',
            otherKey: 'CampaignId',
            as: 'campaigns',        // CHÚ Ý: Đặt tên khác nhau, dùng số nhiều
            onDelete: 'CASCADE'
        });

        await sequelize.sync();

        return {
            sequelize,
            Cart, CartDetails, Category, Comment, Discounts, DiscountsProducts, ShopUserRole,
            Follows, Inventories, Notifications, Order, OrderDetails,
            Otp, Payment, PaymentMethod, Products, Resource, RoleGrants,
            Roles, Shop, User, Wishlists, Partner, Banner, Address, Sku, SpuToSku, SkuAttr, SkuSpecs, Campaign, CampaignShop,
        };
    } catch (error) {
        console.error("Error initializing models:", error);
        throw error;
    }
};

module.exports = initializeModels;