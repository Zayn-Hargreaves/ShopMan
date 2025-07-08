const { getUnselectData } = require("../../utils/index");

class UserRepository {
    constructor(models) {
        this.User = models.User;
        this.Cart = models.Cart;
        this.Address = models.Address;
    }

    async findByEmail(email) {
        return await this.User.findOne({
            where: { email },
            raw: true
        });
    }
    async findByGoogleIdOrEmail(googleId, email) {
        return this.User.findOne({ $or: [{ googleId }, { email }] })
    }
    async findById(id) {
        return await this.User.findByPk(id, {
            attributes: getUnselectData(['password']),
            raw: true
        });
    }

    async findByIdWithCart(id) {
        return await this.User.findByPk(id, {
            include: {
                model: this.Cart,
                as: 'cart'
            },
            attributes: getUnselectData(['password']),
            raw: true
        });
    }
    async getUserProfile(id) {
        return await this.User.findOne({
            where: { id },
            attributes: getUnselectData(['password']),
            include: [{
                model: this.Address,
                as: 'address',
                where: { address_type: 'main' },
                required: false
            }]
        });
    }

    async findByGoogleId(googleId) {
        return await this.User.findOne({
            where: { googleId },
            attributes: getUnselectData(['password']),
            raw: true
        });
    }

    async updatePassword(id, password) {
        console.log(id)
        console.log(password)
        return await this.User.update({ password: password }, { where: { id } });
    }

    async createUser({ name, email, password = null, googleId = null, status = 'active' }) {
        return await this.User.create({ name, email, password, status, googleId });
    }
    async updateUserProfile(UserId, { name, phone, avatar }) {
        return await this.User.update({
            name,
            phone,
            avatar,
        }, {
            where: {
                id: UserId
            }
        })
    }
    async updateFcmToken(id, fcmToken) {
        return await this.User.update(
            { fcmToken },
            { where: { id } }
        );
    }
    async incrementBalance(userId, amount, options ={}){
        return await this.User.increment(
            {balance:amount},
            {where:{id:userId}, ...options}
        )
    }
}

module.exports = UserRepository