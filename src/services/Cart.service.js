const cartRepo = require("../models/repositories/cart.repo");
const RedisService = require("./Redis.Service");
const RepositoryFactory = require("../models/repositories/repositoryFactory");

class CartService {
    static async getCart(UserId) {
        await RepositoryFactory.initialize();
        const CartRepo = RepositoryFactory.getRepository("CartRepository");
        const hashKey = `cart:user:${UserId}`;

        // 1. Lấy cart từ cache Redis
        // let cart = await RedisService.getAllHashField(hashKey);
        let cart
        // 2. Lấy cart thực tế từ DB (các item thực tế user đã add)
        const dbCartItems = await CartRepo.findAllProductInCart(UserId);

        // 3. Nếu cache miss hoặc lệch số lượng -> đồng bộ lại cache
        if (!cart || cart.length === 0 || cart.length !== dbCartItems.length) {
            await RedisService.deleteHashKey(hashKey);

            for (const item of dbCartItems) {
                const fieldKey = `${item.ProductId}|${item.sku_no}`;
                // Chuẩn hóa variant: Ưu tiên sku_attrs, rồi sku_specs, fallback là type/name
                let variant = {};
                if (item.SkuAttr?.sku_attrs && typeof item.SkuAttr.sku_attrs === 'object' && Object.keys(item.SkuAttr.sku_attrs).length > 0) {
                    variant = item.SkuAttr.sku_attrs;
                } else if (item.SkuSpecs?.sku_specs && typeof item.SkuSpecs.sku_specs === 'object' && Object.keys(item.SkuSpecs.sku_specs).length > 0) {
                    variant = item.SkuSpecs.sku_specs;
                } else if (item.Sku) {
                    if (item.Sku.sku_type) variant.type = item.Sku.sku_type;
                    if (item.Sku.sku_name) variant.name = item.Sku.sku_name;
                }


                const simplified = {
                    productId: item.ProductId,
                    productName: item.product?.name || "",
                    discount_percentage: item.product.discount_percentage,
                    slug: item.product.slug,
                    skuNo: item.sku_no,
                    quantity: item.quantity,
                    price: item.SkuAttr?.sku_price || item.Sku?.sku_price || 0,
                    image: item.product?.thumb || "",
                    variant,

                    discounts: [] // Chưa enrich ở đây
                };
                await RedisService.cacheHashField(hashKey, fieldKey, simplified, 3600);
            }

            // Enrich: lấy đủ thông tin discount cho từng item
            const enrichedCart = await Promise.all(
                dbCartItems.map(async (item) => {
                    let variant = {};
                    if (item.SkuAttr?.sku_attrs && typeof item.SkuAttr.sku_attrs === 'object' && Object.keys(item.SkuAttr.sku_attrs).length > 0) {
                        variant = item.SkuAttr.sku_attrs;
                    } else if (item.SkuSpecs?.sku_specs && typeof item.SkuSpecs.sku_specs === 'object' && Object.keys(item.SkuSpecs.sku_specs).length > 0) {
                        variant = item.SkuSpecs.sku_specs;
                    } else if (item.Sku) {
                        if (item.Sku.sku_type) variant.type = item.Sku.sku_type;
                        if (item.Sku.sku_name) variant.name = item.Sku.sku_name;
                    }
                    const discounts = await CartRepo.getAvailableDiscounts(item.ProductId);
                    return {
                        field: `${item.ProductId}|${item.sku_no}`,
                        productId: item.ProductId,
                        productName: item.product?.name || "",
                        discount_percentage: item.product.discount_percentage,
                        slug: item.product.slug,
                        skuNo: item.sku_no,
                        quantity: item.quantity,
                        price: item.SkuAttr?.sku_price || item.Sku?.sku_price || 0,
                        image: item.product?.thumb || "",
                        variant,
                        discounts: discounts || [],
                    };
                })
            );
            return enrichedCart;
        }

        // 4. Nếu cache đúng, enrich thêm discount cho từng item (variant đã sẵn chuẩn)
        const enrichedCachedCart = await Promise.all(
            cart.map(async (item) => {
                const discounts = await CartRepo.getAvailableDiscounts(item.productId);
                return {
                    ...item,
                    discounts: discounts || [],
                };
            })
        );

        return enrichedCachedCart;
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

    static async updateProductToCart(UserId, productId, skuNo, quantity) {
        await RepositoryFactory.initialize();
        const CartRepo = RepositoryFactory.getRepository("CartRepository");
        const result = await CartRepo.updateProductToCart({ UserId, ProductId: productId, sku_no: skuNo, quantity });

        const hashKey = `cart:user:${UserId}`;
        const fieldKey = `${productId}|${skuNo}`;

        await RedisService.updateHashField(
            hashKey,
            fieldKey,
            (old) => {
                if (quantity === 0) return null;
                return {
                    ...old,
                    quantity,
                    price: result.SkuAttr?.sku_price || result.Sku?.sku_price || 0,
                    variant: result.SkuAttr?.sku_attrs || result.SkuSpecs?.sku_specs || {},
                    image: result.Product?.thumb || "",
                    productName: result.Product?.name || ""
                };
            },
            3600
        );

        return { message: "Updated successfully" };
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