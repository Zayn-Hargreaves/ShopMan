class PaymentRepository {
    constructor(models) {
      this.Payment = models.Payment;
    }
  
    async create(paymentData, options) {
      return await this.Payment.create(paymentData, options);
    }
  }
  
  module.exports = PaymentRepository;
  