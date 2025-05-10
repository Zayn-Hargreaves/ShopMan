class InventoryRepository {
    constructor(models) {
        this.Inventories = models.Inventories;
        this.Products = models.Products;
    }

    /**
     * Trừ tồn kho khi xác nhận thanh toán
     */
    async decrementStock({ ProductId, ShopId = null, quantity }) {
        const whereClause = { ProductId };
        if (ShopId) whereClause.ShopId = ShopId;

        const inven = await this.Inventories.findOne({ where: whereClause });
        if (!inven || inven.inven_quantity < quantity) {
            throw new Error("Insufficient inventory");
        }
        inven.inven_quantity -= quantity;
        await inven.save();
    }

    /**
     * Hoàn lại tồn kho (nếu thanh toán thất bại hoặc bị hủy)
     */
    async restoreStock({ ProductId, ShopId = null, quantity }) {
        const whereClause = { ProductId };
        if (ShopId) whereClause.ShopId = ShopId;

        const inven = await this.Inventories.findOne({ where: whereClause });
        if (!inven) {
            throw new Error("Inventory not found to restore");
        }
        inven.inven_quantity += quantity;
        await inven.save();
    }

    /**
     * Cập nhật số lượng bán ra của sản phẩm
     */
    async increaseSaleCount(productId, quantity) {
        await this.Products.increment(
            { sale_count: quantity },
            { where: { id: productId } }
        );
    }

    /**
     * Truy vấn tồn kho hiện tại
     */
    async getCurrentStock(productId, ShopId = null) {
        const whereClause = { ProductId: productId };
        if (ShopId) whereClause.ShopId = ShopId;
        const inven = await this.Inventories.findOne({ where: whereClause });
        return inven ? inven.inven_quantity : 0;
    }
}

module.exports = InventoryRepository;