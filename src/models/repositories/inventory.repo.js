class InventoryRepository {
    constructor(models) {
        this.Inventories = models.Inventories;
        this.Products = models.Products;
    }

    async reduceInventory(productId, quantity) {
        const inven = await this.Inventories.findOne({ where: { ProductId: productId } });
        if (!inven || inven.inven_quantity < quantity) throw new Error("Insufficient inventory");
        inven.inven_quantity -= quantity;
        await inven.save();
    }

    async increaseSaleCount(productId, quantity) {
        await this.Products.increment({ sale_count: quantity }, { where: { id: productId } });
    }
}

module.exports = InventoryRepository;