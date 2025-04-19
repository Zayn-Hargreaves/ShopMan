const CartRepository = require("../models/repositories/cart.repo")
const DiscountService = require("./Discount.Service")
const RedisService = require("./Redis.Service")
class CheckoutService {
    static async checkoutOrder({ cartID, userID, selectedItems, selectedDiscounts = [], user_address, user_payment }) {
        // Lấy thông tin sản phẩm và mã giảm giá
        const checkoutData = await CartRepository.getSelectedItemsForCheckout({
            cartID,
            userID,
            selectedItems,
        });

        let checkOutOrder = {
            totalPrice: checkoutData.cartTotal,
            feeShip: 0, // Có thể tính phí ship dựa trên user_address
            totalDiscount: 0,
            totalCheckout: 0,
        };

        // Áp dụng mã giảm giá
        const shopOrderDetails = checkoutData.shops.map(async (shop) => {
            let shopSubtotal = shop.subtotal;
            let shopDiscount = 0;

            // Áp dụng mã giảm giá cho toàn shop (nếu có)
            const shopDiscountSelection = selectedDiscounts.find(
                (d) => d.ShopId === shop.shop.id && !d.ProductId
            );
            if (shopDiscountSelection) {
                const discount = shop.discounts.find((d) => d.id === shopDiscountSelection.DiscountId);
                if (discount) {
                    if (discount.type === "percentage") {
                        shopDiscount = (parseFloat(discount.value) / 100) * shopSubtotal;
                    } else if (discount.type === "fixed") {
                        shopDiscount = parseFloat(discount.value);
                    }
                    // Cập nhật UserCounts
                    await DiscountService.incrementUserCounts(discount.id);
                }
            } else {
                // Áp dụng mã giảm giá cho từng sản phẩm
                shop.products.forEach(async (product) => {
                    const productDiscountSelection = selectedDiscounts.find(
                        (d) => d.ProductId === product.ProductId
                    );
                    if (productDiscountSelection) {
                        const discount = product.discounts.find(
                            (d) => d.id === productDiscountSelection.DiscountId
                        );
                        if (discount) {
                            const itemTotal = product.itemTotal;
                            let discountAmount = 0;
                            if (discount.type === "percentage") {
                                discountAmount = (parseFloat(discount.value) / 100) * itemTotal;
                            } else if (discount.type === "fixed") {
                                discountAmount = parseFloat(discount.value);
                            }
                            shopDiscount += discountAmount;
                            // Cập nhật UserCounts
                            await DiscountService.incrementUserCounts(discount.id);
                        }
                    }
                });
            }

            shopSubtotal -= shopDiscount;
            checkOutOrder.totalDiscount += shopDiscount;

            return {
                shopID: shop.shop.id,
                shop_discounts: shopDiscountSelection
                    ? [{ code: shopDiscountSelection.code, shopID: shop.shop.id }]
                    : [],
                priceRaw: shop.subtotal,
                priceApplyCheckout: shopSubtotal,
                item_products: shop.products.map((product) => ({
                    productID: product.ProductId,
                    quantity: product.quantity,
                    price: product.product.price,
                })),
            };
        });

        checkOutOrder.totalCheckout = checkOutOrder.totalPrice - checkOutOrder.totalDiscount;

        // Kiểm tra tồn kho và khóa sản phẩm
        const acquiredProducts = [];
        const products = shopOrderDetails.flatMap((order) => order.item_products);
        for (const { productID, quantity } of products) {
            const keyLock = await RedisService.acquireLock({ productID, cartID, quantity });
            acquiredProducts.push(keyLock ? true : false);
            if (keyLock) {
                await RedisService.releaseLock(keyLock);
            }
        }

        if (acquiredProducts.includes(false)) {
            throw new BadRequestError("Some products are out of stock, please check your cart again!");
        }

        // Tạo đơn hàng
        const newOrder = await orderModel.create({
            order_userID: userID,
            order_checkout: checkOutOrder,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shopOrderDetails,
        });

        // Xóa cache
        await RedisService.deleteCachePattern(`checkout:user:${userID}:cart:${cartID}`);

        return newOrder;
    }
}

module.exports = CheckoutService