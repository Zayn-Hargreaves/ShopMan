const cartRepo = require("../models/repositories/cart.repo");
const RedisService = require("./Redis.Service");
const RepositoryFactory = require("../models/repositories/repositoryFactory");

class CartService {
    static async getCart(UserId) {
    await RepositoryFactory.initialize();
    const CartRepo = RepositoryFactory.getRepository("CartRepository");
    const hashKey = `cart:user:${UserId}`;

    // 1. Lấy cart từ cache Redis
    let cart;
    // 2. Lấy cart thực tế từ DB (các item thực tế user đã add)
    const dbCartItems = await CartRepo.findAllProductInCart(UserId);

    // 3. Nếu cache miss hoặc lệch số lượng -> đồng bộ lại cache
    if (!cart || cart.length === 0 || cart.length !== dbCartItems.length) {
        await RedisService.deleteHashKey(hashKey);

        for (const item of dbCartItems) {
            const fieldKey = `${item.ProductId}|${item.sku_no}`;
            // Chuẩn hóa variant
            let variant = {};
            if (item.SkuAttr?.sku_attrs && typeof item.SkuAttr.sku_attrs === 'object' && Object.keys(item.SkuAttr.sku_attrs).length > 0) {
                variant = item.SkuAttr.sku_attrs;
            } else if (item.SkuSpecs?.sku_specs && typeof item.SkuSpecs.sku_specs === 'object' && Object.keys(item.SkuSpecs.sku_specs).length > 0) {
                variant = item.SkuSpecs.sku_specs;
            } else if (item.Sku) {
                if (item.Sku.sku_type) variant.type = item.Sku.sku_type;
                if (item.Sku.sku_name) variant.name = item.Sku.sku_name;
            }

            // KHÔNG lấy discount nữa
            const simplified = {
                id: item.id,
                productId: item.ProductId,
                productName: item.product?.name || "",
                discount_percentage: item.product.discount_percentage,
                slug: item.product.slug,
                skuNo: item.sku_no,
                quantity: item.quantity,
                price: item.SkuAttr?.sku_price || item.Sku?.sku_price || 0,
                image: item.product?.thumb || "",
                variant,
            };
            await RedisService.cacheHashField(hashKey, fieldKey, simplified, 3600);
        }

        return dbCartItems.map(item => {
            let variant = {};
            if (item.SkuAttr?.sku_attrs && typeof item.SkuAttr.sku_attrs === 'object' && Object.keys(item.SkuAttr.sku_attrs).length > 0) {
                variant = item.SkuAttr.sku_attrs;
            } else if (item.SkuSpecs?.sku_specs && typeof item.SkuSpecs.sku_specs === 'object' && Object.keys(item.SkuSpecs.sku_specs).length > 0) {
                variant = item.SkuSpecs.sku_specs;
            } else if (item.Sku) {
                if (item.Sku.sku_type) variant.type = item.Sku.sku_type;
                if (item.Sku.sku_name) variant.name = item.Sku.sku_name;
            }
            return {
                id: item.id,
                productId: item.ProductId,
                productName: item.product?.name || "",
                discount_percentage: item.product.discount_percentage,
                slug: item.product.slug,
                skuNo: item.sku_no,
                quantity: item.quantity,
                price: item.SkuAttr?.sku_price || item.Sku?.sku_price || 0,
                image: item.product?.thumb || "",
                variant
            }
        });
    }

    return cart;
}

    static async getDiscountOfProduct (ProductId){
        const cacheKey = `Discount:ProductId:${ProductId}`
        await RepositoryFactory.initialize()
        const CartRepo = await RepositoryFactory.getRepository("CartRepository")
        let result = RedisService.getCachedData(cacheKey)
        if(result){
            result = await CartRepo.getAvailableDiscounts(ProductId)
            await RedisService.cacheData(cacheKey,600)
        }
        return result
    }


    static async addProductToCart(UserId, productId, skuNo, quantity) {
        if (!UserId || !productId || !skuNo || !quantity || quantity <= 0) {
            throw new Error("Invalid input for adding product to cart");
        }

        await RepositoryFactory.initialize();
        const CartRepo = RepositoryFactory.getRepository("CartRepository");

        const item = await CartRepo.addProductToCart({ UserId, ProductId: productId, sku_no: skuNo, quantity });
        const hashKey = `cart:user:${UserId}`;
        const fieldKey = `${productId}|${skuNo}`;

        const simplified = {
            productId: item.ProductId,
            productName: item.product?.name || "",
            skuNo: item.sku_no,
            quantity: item.quantity,
            price: item.Sku?.SkuAttr?.sku_price || item.Sku?.sku_price || 0,
            image: item.product?.thumb || "",
            variant: item.Sku?.SkuAttr?.sku_attrs || item.Sku?.SkuSpecs?.sku_specs || {},
        };

        const existing = await RedisService.getHashField(hashKey, fieldKey);
        const updated = existing
            ? { ...existing, quantity: existing.quantity + quantity }
            : simplified;

        await RedisService.cacheHashField(hashKey, fieldKey, updated, 3600);
        return updated;
    }

    static async updateProductToCart(UserId, CartDetailId, skuNo, quantity) {
        await RepositoryFactory.initialize();
        const CartRepo = RepositoryFactory.getRepository("CartRepository");

        const oldItem = await CartRepo.findCartDetailById(CartDetailId);
        if (!oldItem) throw new Error('Cart item not found');

        const result = await CartRepo.updateProductToCart({ UserId, CartDetailId, sku_no: skuNo, quantity });

        const hashKey = `cart:user:${UserId}`;

        const oldFieldKey = `${oldItem.ProductId}|${oldItem.sku_no}`;
        await RedisService.removeHashField(hashKey, oldFieldKey);

        if (quantity > 0) {
            const newFieldKey = `${result.ProductId}|${result.sku_no}`;
            const newValue = {
                id: result.id,
                productId: result.ProductId,
                productName: result.product?.name || "",
                discount_percentage: result.product?.discount_percentage || 0,
                slug: result.product?.slug || "",
                skuNo: result.sku_no,
                quantity: result.quantity,
                price: result.SkuAttr?.sku_price || result.Sku?.sku_price || 0,
                image: result.product?.thumb || "",
                variant: result.SkuAttr?.sku_attrs || result.SkuSpecs?.sku_specs || {},
                discounts: [] // tùy enrich
            };
            await RedisService.cacheHashField(hashKey, newFieldKey, newValue, 3600);
        }

        return result;
    }


    static async removeProductFromCart(UserId, productId, skuNo) {
        await RepositoryFactory.initialize();
        const CartRepo = RepositoryFactory.getRepository("CartRepository");
        await CartRepo.removeProductFromCart(UserId, productId, skuNo);

        const hashKey = `cart:user:${UserId}`;
        const fieldKey = `${productId}|${skuNo}`;
        await RedisService.removeHashField(hashKey, fieldKey);

        return { message: "Removed from cart" };
    }

    static async removeAllProductFromCart(UserId, CartDetailIds) {
        await RepositoryFactory.initialize();
        const CartRepo = RepositoryFactory.getRepository("CartRepository");

        const hashKey = `cart:user:${UserId}`;
        await RedisService.deleteHashKey(hashKey);
        return await CartRepo.deleteAllProductFromCart(UserId, CartDetailIds);
    }

    static async getNumberProductInCart(UserId) {
        const hashKey = `cart:user:${UserId}`;
        const cartItems = await RedisService.getAllHashField(hashKey);
        return cartItems.length;
    }
}

module.exports = CartService;