const initializeModels = require("../../db/dbs/associations")

class CartRepository {
    constructor(models) {
        this.Cart = models.Cart
    }
    async createCart({ UserId }) {
        return await this.Cart.create({
            UserId: UserId
        })
    }
    async getCartById({ id }) {
        return await this.Cart.findOne({
            where: {
                id: id
            }
        })
    }
    async getCartByUserId({ UserId }) {
        return await this.Cart.findOne({
            where: {
                UserId: UserId
            }
        })
    }
}

module.exports = async () => {
    const models = await initializeModels()
    return await CartRepository(models)
}