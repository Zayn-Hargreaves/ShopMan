const { ConflictError } = require("../../cores/error.response");
const RepositoryFactory = require("../../models/repositories/repositoryFactory");
const { Op } = require("sequelize");

class InventoryService {
    /**
     * Lấy danh sách tồn kho của shop (có filter, phân trang)
     */
    static async listInventories(shopId, query) {
        await RepositoryFactory.initialize();
        const InventoryRepo = RepositoryFactory.getRepository("InventoryRepository");

        const {
            skuId,
            productId,
            location,
            minQty,
            maxQty,
            page = 1,
            limit = 20,
        } = query;
        return await InventoryRepo.findAllInventory(shopId, skuId, productId, location, minQty, maxQty, page, limit)
    }

    /**
     * Cập nhật tồn kho (chỉ cho owner/manager shop)
     */
    static async updateInventory(shopId, inventoryId, data) {
        await RepositoryFactory.initialize();
        const InventoryRepo = RepositoryFactory.getRepository("InventoryRepository");
        const ProductRepo = RepositoryFactory.getRepository("ProductRepository");

        const inventory = await InventoryRepo.findInventoryById(shopId, inventoryId)
        if (!inventory) throw new ConflictError("Inventory not found or no permission");
        if (typeof data.quantity !== 'undefined') inventory.quantity = data.quantity;
        if (typeof data.location !== 'undefined') inventory.location = data.location;

        await inventory.save();
        const totalStock = await InventoryRepo.sumInventoryBySkuId(inventory.SkuId);
        const sku = await ProductRepo.findSkuById(inventory.SkuId)
        sku.sku_stock = totalStock
        await sku.save()
        return {inventory,sku};
    }
}

module.exports = InventoryService;
