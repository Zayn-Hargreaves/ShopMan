const AddressRepository = require("./address.repo")
const BannerRepository = require("./banner.repo")
const CampaignRepository = require("./campaign.repo")
const CartRepository =require("./cart.repo")
const CategoryRepository = require("./category.repo")
const DiscountRepository = require("./discount.repo")
const OtpRepository = require("./opt.repo")
const ProductRepository = require("./product.repo")
const ShopRepository = require("./shop.repo")
const UserRepository = require("./user.repo")
const WishListRepository = require("./wishlist.repo")
const initializeModels = require("../../db/dbs/associations")
class RepositoryFactory {
    constructor() {
        this.models = null;
        this.repositories = {};
    }

    async initialize() {
        if (!this.models) { 
            this.models = await initializeModels();
            this.repositories = {
                AddressRepository: new AddressRepository(this.models),
                BannerRepository: new BannerRepository(this.models),
                CampaignRepository:new CampaignRepository(this.models),
                CategoryRepository:new CategoryRepository(this.models),
                DiscountRepository:new DiscountRepository(this.models),
                OtpRepository:new OtpRepository(this.models),
                ProductRepository:new ProductRepository(this.models),
                ShopRepository:new ShopRepository(this.models),
                WishListRepository:new WishListRepository(this.models),
                UserRepository: new UserRepository(this.models),
                CartRepository: new CartRepository(this.models),
            };
        }
    }
    
    getRepository(repoName) {
        if (!this.repositories[repoName]) {
            throw new Error(`Repository ${repoName} not found`);
        }
        return this.repositories[repoName];
    }
}

const factory = new RepositoryFactory();

module.exports = factory