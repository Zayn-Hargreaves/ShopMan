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
const initializeCampaignCategory = require("../../models/CampaignCategory.model")
const initializeModels = async () => {
    try {
        const database = await databasePromise();
        const sequelize = database.getSequelize();

        // Khởi tạo models
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
        const CampaignCategory = await initializeCampaignCategory(sequelize)
        const CampaignShop = await initializeCampaignShop(sequelize)


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
        Products.belongsToMany(Discounts, {
            through: DiscountsProducts,
            foreignKey: 'ProductId',
            otherKey: 'DiscountId',
            as: 'discounts'
        });

        Discounts.belongsToMany(Products, {
            through: DiscountsProducts,
            foreignKey: 'DiscountId',
            otherKey: 'ProductId',
            as: 'products'
        });

        // Quan hệ User - Follows (1-n)
        User.hasMany(Follows, { foreignKey: { name: "UserId" }, as: "follows" });
        Follows.belongsTo(User, { foreignKey: { name: "UserId" }, as: "user" });

        // Quan hệ Shop - Follows (1-n)
        Shop.hasMany(Follows, { foreignKey: { name: "ShopId" }, as: "follows" });
        Follows.belongsTo(Shop, { foreignKey: { name: "ShopId" }, as: "shop" });

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
        User.hasMany(Wishlists, { foreignKey: { name: "UserId" }, as: "wishlists" });
        Wishlists.belongsTo(User, { foreignKey: { name: "UserId" }, as: "user" });

        // Quan hệ Products - WishLists (1-n)
        Products.hasMany(Wishlists, { foreignKey: { name: "ProductId" }, as: "wishlists" });
        Wishlists.belongsTo(Products, { foreignKey: { name: "ProductId" }, as: "product" });

        Shop.hasMany(Banner, { foreignKey: { name: "ShopId" }, as: 'banners' })
        Banner.belongsTo(Shop, { foreignKey: { name: 'ShopId' }, as: 'shops' })

        Partner.hasMany(Banner, { foreignKey: { name: "PartnerId" }, as: 'banners' })
        Banner.belongsTo(Partner, { foreignKey: { name: "PartnerId" }, as: 'partners' })

        User.hasMany(Address, { foreignKey: 'UserId', as: "address" })
        Address.belongsTo(User, { foreignKey: "UserId", as: "users" })

        Discounts.hasMany(Banner, { foreignKey: { name: "DiscountId" }, as: 'banners' })
        Banner.belongsTo(Discounts, { foreignKey: { name: "DiscountId" }, as: 'discount' })

        Products.hasMany(SpuToSku, { foreignKey: 'ProductId', sourceKey: 'id', as: 'SpuToSkus', foreignKeyConstraints: false })
        SpuToSku.belongsTo(Products, { foreignKey: 'ProductId', targetKey: 'id', as: 'Product', foreignKeyConstraints: false })

        Sku.hasMany(SpuToSku, { foreignKey: 'sku_no', sourceKey: 'sku_no', foreignKeyConstraints: false })
        SpuToSku.belongsTo(Sku, { foreignKey: 'sku_no', targetKey: 'sku_no', as: 'Sku', foreignKeyConstraints: false })

        Sku.hasOne(SkuAttr, { foreignKey: 'sku_no', sourceKey: 'sku_no', as: 'SkuAttr', foreignKeyConstraints: false })
        SkuAttr.belongsTo(Sku, { foreignKey: 'sku_no', targetKey: 'sku_no', foreignKeyConstraints: false })

        Sku.hasOne(SkuSpecs, { foreignKey: 'SkuId', sourceKey: 'id', as: 'SkuSpecs', foreignKeyConstraints: false });
        SkuSpecs.belongsTo(Sku, { foreignKey: 'SkuId', targetKey: 'id', foreignKeyConstraints: false });

        Campaign.hasMany(Discounts, { foreignKey: { name: 'CampaignId' }, as: 'discount' })
        Discounts.belongsTo(Campaign, { foreignKey: { name: 'CampaignId' }, as: 'campaign' })

        Campaign.hasMany(CampaignCategory, { foreignKey: { name: 'CampaignId' }, as: 'campaignCategory' })
        CampaignCategory.belongsTo(Campaign, { foreignKey: { name: 'CampaignId' }, as: 'campaignCategory' })

        Category.hasMany(CampaignCategory, { foreignKey: { name: 'CategoryId' }, as: 'category' })
        CampaignCategory.belongsTo(Category, { foreignKey: { name: 'CategoryId' }, as: 'category' })

        await sequelize.sync();

        return {
            Cart, CartDetails, Category, Comment, Discounts, DiscountsProducts,
            Follows, Inventories, Notifications, Order, OrderDetails,
            Otp, Payment, PaymentMethod, Products, Resource, RoleGrants,
            Roles, Shop, User, Wishlists, Partner, Banner, Address, Sku, SpuToSku, SkuAttr, SkuSpecs, Campaign, CampaignCategory, CampaignShop,
        };
    } catch (error) {
        console.error("Error initializing models:", error);
        throw error;
    }
};

module.exports = initializeModels;