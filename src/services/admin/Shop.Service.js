const { NotFoundError } = require("../../cores/error.response");
const RepositoryFactory = require("../../models/repositories/repositoryFactory");
const { Op } = require("sequelize");

class ShopService {
    
    static async getShopByUserId(userId,shopId) {
        await RepositoryFactory.initialize();
        const ShopRepo = RepositoryFactory.getRepository("ShopRepository");
        const shop = await ShopRepo.findShopByUserId(userId,shopId);
        if (!shop) throw new NotFoundError("Shop not found");
        return shop;
    }

   
    static async registerShop(data, userId) {
        await RepositoryFactory.initialize();
        const ShopRepo = RepositoryFactory.getRepository("ShopRepository");
        const ShopUserRoleRepo = RepositoryFactory.getRepository("ShopUserRoleRepository")
        
        
        if (!data.name) throw new NotFoundError("Shop name is required");
        const role = await ShopUserRoleRepo.findOneRole('seller')
        const existed = await ShopUserRoleRepo.checkSeller(userId,role.id);
        if (existed) throw new NotFoundError("User already has a shop");
        data.RolesId = role.id
        const shop = await ShopRepo.createNewShop(userId,data);
        await ShopUserRoleRepo.createNewShopUserRole(userId, shop.id, role.id)
        return shop;
    }

   
    static async updateShop(shopId, data) {
        await RepositoryFactory.initialize();
        const ShopRepo = RepositoryFactory.getRepository("ShopRepository");
        const shop = await ShopRepo.findShopByPk(shopId);
        if (!shop) throw new NotFoundError("Shop not found");
        Object.assign(shop, data);
        await shop.save();
        return shop;
    }

    static async getShopById(shopId) {
        await RepositoryFactory.initialize();
        const ShopRepo = RepositoryFactory.getRepository("ShopRepository");
        const shop = await ShopRepo.findShopByPk(shopId);
        if (!shop) throw new NotFoundError("Shop not found");
        return shop;
    }

  
    static async listShops(query) {
        await RepositoryFactory.initialize();
        const ShopRepo = RepositoryFactory.getRepository("ShopRepository");
        const {
            status, name, page = 1, limit = 20
        } = query;

        return await ShopRepo.getListShopsByAdmin(status, name, page,limit)
    }


    static async updateStatus(shopId, status) {
        await RepositoryFactory.initialize();
        const ShopRepo = RepositoryFactory.getRepository("ShopRepository");
        const shop = await ShopRepo.findShopByPk(shopId);
        if (!shop) throw new NotFoundError("Shop not found");
        shop.status = status;
        await shop.save();
        return shop;
    }
}

module.exports = ShopService;
