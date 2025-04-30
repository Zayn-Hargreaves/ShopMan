class PaymentRepository {
    constructor(models) {
        this.Payment = models.Payment;
    }

    async createPayment({ userId, totalPrice, orderId, paymentMethodId }) {
        return await this.Payment.create({
            UserId: userId,
            TotalPrice: totalPrice,
            OrderId: orderId,
            PaymentMethodId: paymentMethodId,
            Status: "succeeded",
        });
    }
}

module.exports = PaymentRepository;