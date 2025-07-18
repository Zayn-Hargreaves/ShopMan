const { NotFoundError, ConflictError } = require("../../cores/error.response");
const { Op } = require("sequelize")
class InventoryRepository {
    constructor(models) {
        this.Inventories = models.Inventories;
        this.Products = models.Products;
        this.Sku = models.Sku
        this.Shop = models.Shop
        this.SkuAttr = models.SkuAttr
        this.SkuSpecs = models.SkuSpecs
        this.Category = models.Category
    }

    /**
     * Trừ tồn kho khi xác nhận thanh toán
     */
    async decrementStock({ skuNo, ShopId = null, quantity }) {
        const holderSku = await this.Sku.findOne({ where: { sku_no: skuNo } });
        if (!holderSku) {
            throw new NotFoundError("Something went wrong, product not found")
        }
        const whereClause = { SkuId: holderSku.id };
        if (ShopId) whereClause.ShopId = ShopId;

        const inven = await this.Inventories.findOne({ where: whereClause });
        if (!inven || inven.inven_quantity < quantity) {
            throw new ConflictError("Insufficient inventory");
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
        options }) {
        const whereClause = { SkuId };
        if (ShopId) whereClause.ShopId = ShopId;

        return await this.Inventories.increment(
            { quantity: quantity },
            { where: whereClause, ...options }
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

    async findAllInventory(ShopId, SkuId, ProductId, location, minQty, maxQty, page, limit) {
        let where = {}
        let include = []

        if (ShopId) where.ShopId = ShopId;
        if (SkuId) where.SkuId = SkuId;
        if (location) where.location = { [Op.iLike]: `%${location}%` };

        // Gộp minQty, maxQty vào 1 object
        if (minQty || maxQty) {
            where.quantity = {};
            if (minQty) where.quantity[Op.gte] = +minQty;
            if (maxQty) where.quantity[Op.lte] = +maxQty;
        }

        // Nested include để lọc ProductId
        let skuInclude = {
            model: this.Sku,
            as: "sku",
            attributes: ['sku_no', 'sku_name', 'sku_price', 'status'],
            include: [
                {
                    model: this.Products,
                    as: "Product",
                    attributes: ['name', 'thumb'],
                    include: [
                        {
                            model: this.Category,
                            as: "category",
                            attributes: ['id', 'name']
                        }
                    ]
                },
                {
                    model: this.SkuAttr,
                    as: "SkuAttr",
                    attributes: ['sku_attrs']
                }
            ]
        };

        // Nếu có ProductId, filter ngay trong include Product
        if (ProductId) {
            skuInclude.include[0].where = { id: ProductId };
            skuInclude.include[0].required = true; // Đảm bảo chỉ lấy inventory thuộc các SKU có ProductId này
        }

        include.push(
            skuInclude,
            {
                model: this.Shop,
                as: "shop",
                attributes: ['id', 'name', 'logo', 'shopLocation', 'status']
            }
        );

        const offset = (page - 1) * limit;
        const { rows, count } = await this.Inventories.findAndCountAll({
            where,
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            include
        });

        return {
            items: rows,
            page: page,
            limit: limit,
            totalPages: Math.ceil(count / limit),
            total: count
        };
    }


    async sumInventoryBySkuId(SkuId) {
        const result = await this.Inventories.sum('quantity', {
            where: { SkuId }
        });
        return result || 0;
    }
    async findInventoryById(ShopId, id) {
        return await this.Inventories.findOne({ where: { id, ShopId } })
    }
}

module.exports = InventoryRepository;