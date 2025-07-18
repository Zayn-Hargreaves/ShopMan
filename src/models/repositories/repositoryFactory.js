const AddressRepository = require("./address.repo")
const BannerRepository = require("./banner.repo")
const CampaignRepository = require("./campaign.repo")
const CartRepository = require("./cart.repo")
const CategoryRepository = require("./category.repo")
const DiscountRepository = require("./discount.repo")
const OtpRepository = require("./otp.repo")
const ProductRepository = require("./product.repo")
const ShopRepository = require("./shop.repo")
const UserRepository = require("./user.repo")
const WishListRepository = require("./wishlist.repo")
const OrderRepository = require("./order.repo")
const InventoryRepository = require("./inventory.repo")
const PaymentRepository = require("./payment.repo")
const NotificationRepository = require("./notification.repo")

const initializeModels = require("../../db/dbs/associations")
const FollowRepository = require("./follow.repo")
const CommentRepository = require("./comment.repo")
const PaymentMethodRepository = require("./PaymentMethod.repo")
const ShopUserRoleRepository = require("./ShopUserRole.repo")
const RoleGrantRepository = require("./RoleGrant.repo")

class RepositoryFactory {
    constructor() {
        this.models = null;
        this.repositories = {};
        this.sequelize = null;
    }

    async initialize() {
        if (!this.models) {
            this.models = await initializeModels();
            this.sequelize = this.models.sequelize
            this.repositories = {
                AddressRepository: new AddressRepository(this.models),
                BannerRepository: new BannerRepository(this.models),
                CampaignRepository: new CampaignRepository(this.models),
                CategoryRepository: new CategoryRepository(this.models),
                DiscountRepository: new DiscountRepository(this.models),
                OtpRepository: new OtpRepository(this.models),
                ProductRepository: new ProductRepository(this.models),
                ShopRepository: new ShopRepository(this.models),
                WishListRepository: new WishListRepository(this.models),
                UserRepository: new UserRepository(this.models),
                CartRepository: new CartRepository(this.models),
                OrderRepository: new OrderRepository(this.models),
                InventoryRepository: new InventoryRepository(this.models),
                PaymentRepository: new PaymentRepository(this.models),
                NotificationRepository: new NotificationRepository(this.models),
                FollowRepository: new FollowRepository(this.models),
                CommentRepository: new CommentRepository(this.models),
                PaymentMethodRepository: new PaymentMethodRepository(this.models),
                ShopUserRoleRepository: new ShopUserRoleRepository(this.models),
                RoleGrantRepository: new RoleGrantRepository(this.models)
            };
        }
    }

    getRepository(repoName) {
        if (!this.repositories[repoName]) {
            throw new Error(`Repository ${repoName} not found`);
        }
        return this.repositories[repoName];
    }
    getSequelize() {
        if (!this.sequelize) {
            throw new Error("Sequelize instance not initialized. Call initialize() first.");
        }
        return this.sequelize;
    }
}

const factory = new RepositoryFactory();

module.exports = factory