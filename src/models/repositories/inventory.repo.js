const { NotFoundError } = require("../../cores/error.response");

class InventoryRepository {
    constructor(models) {
        this.Inventories = models.Inventories;
        this.Products = models.Products;
        this.Sku = models.Sku
    }

    /**
     * Trừ tồn kho khi xác nhận thanh toán
     */
    async decrementStock({ skuNo, ShopId = null, quantity }) {
        const holderSku = await this.Sku.findOne({where:{sku_no:skuNo}});
        if(!holderSku){
            throw new NotFoundError("Something went wrong, product not found")
        }
        const whereClause = { SkuId: holderSku.id};
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
    async restoreStock({ SkuId,
                    ShopId,
                    quantity,
                    options}) {
        const whereClause = { SkuId };
        if (ShopId) whereClause.ShopId = ShopId;
        
        return await this.Inventories.increment(
            {quantity:quantity},
            {where:whereClause, ...options}
        )
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