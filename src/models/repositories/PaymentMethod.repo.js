class PaymentMethodsRepository {
    constructor(model) {
        this.PaymentMethod = model.PaymentMethod
    }
    async getAllPaymentMethod() {
        return this.PaymentMethod.findAll({ Where: { status: 'active' } })
    }
    async findPaymentMethodById(id) {
        return await this.PaymentMethod.findByPk(id)
    }
}

module.exports = PaymentMethodsRepository