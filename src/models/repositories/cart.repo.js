const initializeModels = require("../../db/dbs/associations")
const { getSelectData } = require("../../utils")

class CartRepository {
    constructor(models) {
        this.Cart = models.Cart
        this.Products = models.Products
        this.SpuToSku = models.SpuToSku
        this.Sku = models.Sku
        this.SkuAttr = models.SkuAttr
        this.SkuSpec = models.SkuSpec
        this.Shop = models.Shop
    }
    async getOrCreateCart(UserId) {
        let cart = await this.Cart.findOne({
            where: { UserId, cart_status: "active" },
        });

        if (!cart) {
            cart = await this.Carts.create({
                UserId,
                cart_total: 0,
                cart_status: "active",
            });
        }

        return cart;
    }

    async findAllProductInCart({ UserId, page = 1, size = 20 }) {
        const offset = (page - 1) * size
        const cart = await this.Cart.find({
            where: {
                UserId: UserId,
                cart_status: 'active'
            },

        })
        if (!cart) {
            return {
                totalItems: 0,
                totalPages: 0,
                currentPage: page,
                product: []
            }
        }
        const { count, rows } = this.CartsDetails.findOneAndCountAll({
            where: {
                CartId: cart.id
            },
            include: {
                model: this.Products,
                where: { status: 'active' },
                attributes: getSelectData(['id', 'slug', 'name', 'thumb', 'sale_count', 'rating', 'price', 'discount_percentage']),
                include: {
                    model: this.SpuToSku,
                    required: false,
                    include: {
                        model: this.Sku,
                        required: false,
                        include: [
                            { model: this.SkuAttr, required: false },
                            { mode: this.SkuSpec, require: false }
                        ]
                    }
                }
            },
            offset,
            limit: size
        })
        return {
            totalItems: count,
            totalPages: Math.ceil(count / size),
            currentPage: page,
            products: rows.map((item) => ({
                ProductId: item.ProductId,
                quantity: item.quantity,
                product: item.Product,
            })),
        }
    }
    async addProductToCart({ UserId, ProductId, quantity }) {
        if (!UserId || !ProductId || !quantity || quantity <= 0) {
            throw new Error("Missing or invalid UserId, ProductId, or quantity");
        }

        try {
            const cart = await this.getOrCreateCart(UserId);

            let cartDetail = await this.CartsDetails.findOne({
                where: { CartId: cart.id, ProductId },
            });

            if (cartDetail) {
                cartDetail.quantity += quantity;
                await cartDetail.save();
            } else {
                cartDetail = await this.CartsDetails.create({
                    CartId: cart.id,
                    ProductId,
                    quantity,
                });
            }

            await this.updateCartTotal(cart.id);

            return cartDetail;
        } catch (error) {
            console.error(`Error adding product ${ProductId} to cart for UserId ${UserId}:`, error);
            throw new Error("Failed to add product to cart");
        }
    }

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    async updateProductToCart({ UserId, ProductId, quantity }) {
        if (!UserId || !ProductId || !quantity || quantity < 0) {
            throw new Error("Missing or invalid UserId, ProductId, or quantity");
        }

        try {
            const cart = await this.Carts.findOne({
                where: { UserId, cart_status: "active" },
            });

            if (!cart) {
                throw new Error("Cart not found");
            }

            const cartDetail = await this.CartsDetails.findOne({
                where: { CartId: cart.id, ProductId },
            });

            if (!cartDetail) {
                throw new Error("Product not found in cart");
            }

            if (quantity === 0) {
                await cartDetail.destroy();
            } else {
                cartDetail.quantity = quantity;
                await cartDetail.save();
            }

            await this.updateCartTotal(cart.id);

            return { message: "Product updated successfully" };
        } catch (error) {
            console.error(`Error updating product ${ProductId} in cart for UserId ${UserId}:`, error);
            throw new Error("Failed to update product in cart");
        }
    }

    async removeProductFromCart({ UserId, ProductId }) {
        if (!UserId || !ProductId) {
            throw new Error("Missing UserId or ProductId");
        }

        try {
            const cart = await this.Carts.findOne({
                where: { UserId, cart_status: "active" },
            });

            if (!cart) {
                throw new Error("Cart not found");
            }

            const deletedCount = await this.CartsDetails.destroy({
                where: { CartId: cart.id, ProductId },
            });

            await this.updateCartTotal(cart.id);

            return {
                deletedCount,
                message: deletedCount > 0 ? "Product removed successfully" : "Product not found in cart",
            };
        } catch (error) {
            console.error(`Error removing product ${ProductId} from cart for UserId ${UserId}:`, error);
            throw new Error("Failed to remove product from cart");
        }
    }

    async deleteAllProductFromCart(UserId) {
        if (!UserId) {
            throw new Error("Missing UserId");
        }

        try {
            const cart = await this.Carts.findOne({
                where: { UserId, cart_status: "active" },
            });

            if (!cart) {
                return { deletedCount: 0, message: "Cart not found" };
            }

            const deletedCount = await this.CartsDetails.destroy({
                where: { CartId: cart.id },
            });

            await this.updateCartTotal(cart.id);

            return {
                deletedCount,
                message: deletedCount > 0 ? "All products removed successfully" : "No products found in cart",
            };
        } catch (error) {
            console.error(`Error deleting all products from cart for UserId ${UserId}:`, error);
            throw new Error("Failed to delete all products from cart");
        }
    }

    async updateCartTotal(CartId) {
        try {
            const cartDetails = await this.CartsDetails.findAll({
                where: { CartId },
                include: [
                    {
                        model: this.Products,
                        as: "Product",
                        attributes: ["id"],
                        include: [
                            {
                                model: this.SpuToSku,
                                as: "SpuToSku",
                                include: [
                                    {
                                        model: this.Sku,
                                        as: "Sku",
                                        attributes: ["sku_price"],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });

            let total = 0;
            for (const detail of cartDetails) {
                const sku = detail.Product?.SpuToSku?.Sku;
                if (sku && sku.sku_price) {
                    total += detail.quantity * parseFloat(sku.sku_price);
                }
            }

            await this.Cart.update(
                { cart_total: total },
                { where: { id: CartId } }
            );
        } catch (error) {
            console.error(`Error updating cart total for CartId ${CartId}:`, error);
            throw error;
        }
    }

    async getSelectedItemsForCheckout({ CartId, UserId, SelectedItems = [] }) {
        if (!CartId || !UserId) {
            throw new Error("Missing CartId or UserId")
        }
        if (!SelectedItems.length) {
            throw new Error("No Items selected")
        }
        try {
            const cart = this.Cart.findOne({
                where: {
                    id: CartId,
                    UserId: UserId,
                    cart_status: 'active'
                }
            })
            if (!cart) {
                throw new Error("Cart not found")
            }
            const productIds = SelectedItems.map((item) => item.id)
            const cartDetails = await this.CartsDetails.findAll({
                where: {
                    CartId: CartId,
                    ProductId: { [Op.in]: productIds }
                },
                include: [
                    {
                        model: this.Products,
                        where: { status: 'active' },
                        attributes: getSelectData(['id', 'slug', 'name', 'sale_count', 'ShopId', 'price', 'thumb']),
                        include: [
                            {
                                model: this.SpuToSku,
                                require: false,
                                include: [
                                    {
                                        model: this.Sku,
                                        require: false,
                                        attributes: getSelectData(['sku_price'])
                                    }
                                ]
                            },
                            {
                                model: this.Shop,
                                attributes: getSelectData(['id', 'name', 'slug'])
                            }
                        ]
                    }
                ]
            })

            if (cartDetails.length !== SelectedItems.length) {
                throw new Error("Some selected items are not in the cart");
            }

            const shopsMap = new Map();
            for (const detail of cartDetails) {
                const selectedItem = selectedItems.find((item) => item.productID === detail.ProductId);
                const shopId = detail.Product.ShopId;

                if (!shopsMap.has(shopId)) {
                    shopsMap.set(shopId, {
                        shop: detail.Product.Shop,
                        products: [],
                        discounts: [],
                        subtotal: 0,
                    });
                }

                const shopData = shopsMap.get(shopId);
                const price = detail.Product.SpuToSku?.Sku?.sku_price || detail.Product.price;
                const itemTotal = selectedItem.quantity * parseFloat(price);

                const discounts = await this.Discounts.findAll({
                    include: [
                        {
                            model: this.DiscountsProducts,
                            as: "DiscountsProducts",
                            where: { ProductId: detail.ProductId },
                            attributes: [],
                        },
                    ],
                    where: {
                        status: "active",
                        StartDate: { [Op.lte]: new Date() },
                        EndDate: { [Op.gte]: new Date() },
                        UserCounts: { [Op.lt]: this.Discounts.MaxUses },
                    },
                    attributes: getSelectData(['id', 'name', 'desc', 'value', 'type', 'code', 'StartDate', 'EndDate', 'MinValueOrders']),
                });

                const applicableDiscounts = discounts.filter(
                    (discount) => itemTotal >= parseFloat(discount.MinValueOrders)
                );

                shopData.products.push({
                    ProductId: detail.ProductId,
                    quantity: selectedItem.quantity,
                    product: detail.Product,
                    itemTotal,
                    discounts: applicableDiscounts,
                });
                shopData.subtotal += itemTotal;

                if (!shopData.discounts.length) {
                    const shopDiscounts = await this.Discounts.findAll({
                        where: {
                            ShopId: shopId,
                            status: "active",
                            StartDate: { [Op.lte]: new Date() },
                            EndDate: { [Op.gte]: new Date() },
                            UserCounts: { [Op.lt]: this.Discounts.MaxUses },
                        },
                        attributes: getSelectData(['id', 'name', 'desc', 'value', 'type', 'code', 'StartDate', 'EndDate', 'MinValueOrders']),
                    });
                    shopData.discounts = shopDiscounts.filter(
                        (discount) => shopData.subtotal >= parseFloat(discount.MinValueOrders)
                    );
                }
            }

            const shops = Array.from(shopsMap.values());
            const cartTotal = shops.reduce((sum, shop) => sum + shop.subtotal, 0);
            return {
                cartTotal,
                shops,
            };
        } catch (error) {
            throw new Error(error)
        }
    }


}
module.exports = async () => {
    const models = await initializeModels()
    return await CartRepository(models)
}