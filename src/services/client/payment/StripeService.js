const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class StripeService {
    static async createPayment({ amount, currency, meta }) {
        const intent = await stripe.paymentIntents.create({
            amount,
            currency,
            metadata: meta,
        });
        return {
            status: 'pending',
            paymentIntentId: intent.id,
            clientSecret: intent.client_secret,
        };
    }
    static async verifyPayment(paymentIntentId) {
        const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
        return intent.status === 'succeeded';
    }
}
module.exports = StripeService;
