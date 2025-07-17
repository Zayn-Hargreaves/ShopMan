class CODService {
    static async createPayment({ amount, currency, meta }) {
        return {
            status: 'pending',
            paymentIntentId: null,
            clientSecret: null,
        };
    }
    static async verifyPayment(paymentIntentId) {
        return true;
    }
}
module.exports = CODService;
