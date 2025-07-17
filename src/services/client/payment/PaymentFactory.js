// payment/PaymentFactory.js
const StripeService = require('./StripeService');
const CODService = require('./CODService');

class PaymentFactory {
    static getPaymentService(method) {
        switch (method) {
            case 'Stripe': return StripeService;
            case 'COD': return CODService;
            default: throw new Error("Unsupported payment method ::", method);
        }
    }
}
module.exports = PaymentFactory;
