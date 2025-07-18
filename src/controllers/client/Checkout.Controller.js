const { OkResponse } = require("../../cores/success.response");
const CheckoutService = require("../../services/client/Checkout.Service");

class CheckoutController {

    getAllPaymentMethod = async (req, res, next) => {
        return new OkResponse({
            message: " get all payment method success",
            metadata: await CheckoutService.getPaymentMethod()
        }).send(res)
    }

    checkout = async (req, res, next) => {
        const { selectedItems, addressId, paymentMethodId, source } = req.body; // [{ productId, skuNo, quantity }]
        const userId = req.userId;

        const result = await CheckoutService.checkout({ userId, selectedItems, addressId, paymentMethodId, source });

        new OkResponse({
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

        new OkResponse({
            message: "Xác nhận đơn hàng thành công",
            metadata: result,
        }).send(res);
    };
}

module.exports = new CheckoutController();
