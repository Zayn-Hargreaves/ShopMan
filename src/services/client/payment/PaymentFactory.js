// payment/PaymentFactory.js
const StripeService = require('./StripeService');
const CODService = require('./CODService');
const { NotFoundError } = require('../../../cores/error.response');

class PaymentFactory {
    static getPaymentService(method) {
        switch (method) {
            case 'Stripe': return StripeService;
            case 'COD': return CODService;
            default: throw new NotFoundError("Unsupported payment method ::", method);
        }
    }
}
module.exports = PaymentFactory;
