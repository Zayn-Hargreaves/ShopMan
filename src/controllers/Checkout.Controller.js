const { OkResponse } = require("../cores/success.response");
const CheckoutService = require("../services/Checkout.Service");

class CheckoutController {
    /**
     * POST /checkout/buynow
     * @desc Checkout trực tiếp 1 sản phẩm
     */
    buyNow = async (req, res, next) => {
        const { productId, skuNo, quantity } = req.body;
        const userId = req.userId;

        const result = await CheckoutService.buyNow({ userId, productId, skuNo, quantity });

        return new OkResponse({
            message: "Tạo thanh toán buy-now thành công",
            metadata: result,
        }).send(res);
    };

    /**
     * POST /checkout/from-cart
     * @desc Checkout từ danh sách sản phẩm trong giỏ hàng
     */
    fromCart = async (req, res, next) => {
        const { selectedItems } = req.body; // [{ productId, skuNo, quantity }]
        const userId = req.userId;

        const result = await CheckoutService.fromCart({ userId, selectedItems });

        return new OkResponse({
            message: "Tạo thanh toán từ cart thành công",
            metadata: result,
        }).send(res);
    };

    /**
     * POST /checkout/confirm
     * @desc Sau khi phía client thanh toán Stripe xong thì gọi về để tạo đơn hàng
     */
    confirmPayment = async (req, res, next) => {
        const { paymentIntentId } = req.body;
        const userId = req.userId;

        const result = await CheckoutService.confirmPayment({ userId, paymentIntentId });

        return new OkResponse({
            message: "Xác nhận đơn hàng thành công",
            metadata: result,
        }).send(res);
    };
}

module.exports = new CheckoutController();
