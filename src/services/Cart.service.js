const cartRepo = require("../models/repositories/cart.repo");
const RedisService = require("./Redis.Service");
const RepositoryFactory = require("../models/repositories/repositoryFactory");

class CartService {
    static async getCart(UserId) {
        await RepositoryFactory.initialize();
        const CartRepo = RepositoryFactory.getRepository("CartRepository");

        const hashKey = `cart:user:${UserId}`;
        let cart = await RedisService.getAllHashField(hashKey);

        if (!cart || cart.length === 0) {
            const dbCartItems = await CartRepo.findAllProductInCart(UserId);
            if (!dbCartItems || dbCartItems.length === 0) return [];

            for (const item of dbCartItems) {
                const fieldKey = `${item.ProductId}|${item.sku_no}`;

                const simplified = {
                    productId: item.ProductId,
                    productName: item.Product?.name || "",
                    skuNo: item.sku_no,
                    quantity: item.quantity,
                    price: item.SkuAttr?.sku_price || item.Sku?.sku_price || 0,
                    image: item.Product?.thumb || "",
                    variant: item.SkuAttr?.sku_attrs || item.SkuSpecs?.sku_specs || {},
                    discounts: [] 
                };

                await RedisService.cacheHashField(hashKey, fieldKey, simplified, 3600);
            }

            const enrichedCart = await Promise.all(
                dbCartItems.map(async (item) => {
                    const discounts = await CartRepo.getAvailableDiscounts(item.ProductId);
                    return {
                        field: `${item.ProductId}|${item.sku_no}`,
                        productId: item.ProductId,
                        productName: item.Product?.name || "",
                        skuNo: item.sku_no,
                        quantity: item.quantity,
                        price: item.SkuAttr?.sku_price || item.Sku?.sku_price || 0,
                        image: item.Product?.thumb || "",
                        variant: item.SkuAttr?.sku_attrs || item.SkuSpecs?.sku_specs || {},
                        discounts: discounts || [],
                    };
                })
            );

            return enrichedCart;
        }

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
            productName: item.Product?.name || "",
            skuNo: item.sku_no,
            quantity: item.quantity,
            price: item.SkuAttr?.sku_price || item.Sku?.sku_price || 0,
            image: item.Product?.thumb || "",
            variant: item.SkuAttr?.sku_attrs || item.SkuSpecs?.sku_specs || {},
        };

        await RedisService.cacheHashField(hashKey, fieldKey, simplified, 3600);

        return simplified;
    }

    static async updateProductToCart(UserId, productId, skuNo, quantity) {
        await RepositoryFactory.initialize();
        const CartRepo = RepositoryFactory.getRepository("CartRepository");

        const result = await CartRepo.updateProductToCart({ UserId, ProductId: productId, sku_no: skuNo, quantity });

        const hashKey = `cart:user:${UserId}`;
        const fieldKey = `${productId}|${skuNo}`;

        if (quantity === 0) {
            await RedisService.removeHashField(hashKey, fieldKey);
        } else {
            const simplified = {
                productId: result.ProductId,
                productName: result.Product?.name || "",
                skuNo: result.sku_no,
                quantity: result.quantity,
                price: result.SkuAttr?.sku_price || result.Sku?.sku_price || 0,
                image: result.Product?.thumb || "",
                variant: result.SkuAttr?.sku_attrs || result.SkuSpecs?.sku_specs || {},
            };
            await RedisService.cacheHashField(hashKey, fieldKey, simplified, 3600);
        }

        return { message: "Updated successfully" };
    }

    static async removeProductFromCart(UserId, productId, skuNo) {
        await RepositoryFactory.initialize();
        const CartRepo = RepositoryFactory.getRepository("CartRepository");

        await CartRepo.removeProductFromCart({ UserId, ProductId: productId, sku_no: skuNo });

        const hashKey = `cart:user:${UserId}`;
        const fieldKey = `${productId}|${skuNo}`;
        await RedisService.removeHashField(hashKey, fieldKey)

        return { message: "Removed from cart" };
    }

    static async removeAllProductFromCart(UserId) {
        await RepositoryFactory.initialize();
        const CartRepo = RepositoryFactory.getRepository("CartRepository");
        await CartRepo.deleteAllProductFromCart(UserId);

        const hashKey = `cart:user:${UserId}`;
        await RedisService.removeHashField(hashKey);
        return { message: "Cart cleared" };
    }

    static async getNumberProductInCart(UserId) {
        const hashKey = `cart:user:${UserId}`;
        const cartItems = await RedisService.getAllHashField(hashKey);
        return cartItems.length;
    }
}

module.exports = CartService;
