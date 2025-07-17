const { getUnselectData } = require("../../utils/index");
const {Op} = require("sequelize")
class UserRepository {
    constructor(models) {
        this.User = models.User;
        this.Cart = models.Cart;
        this.Address = models.Address;
        this.ShopUserRole = models.ShopUserRole
        this.Shop = models.Shop
        this.Roles = models.Roles
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
        const user = await this.User.findOne({
            where: { id },
            attributes: getUnselectData(['password']),
            include: [{
                model: this.Address,
                as: 'address',
                where: { address_type: 'main' },
                required: false
            }]
        });
        const shopRoles = await this.ShopUserRole.findAll({
            where: { UserId: id },
            include: [
                { model: this.Shop, as: 'shop' },
                { model: this.Roles, as: 'role' }
            ]
        });
        return {
            user,
            shops: shopRoles.map(r => ({
                ShopId: r.ShopId,
                shopName: r.shopName,
                role: r.role.role_name
            }))
        }
    }

    async findByGoogleId(googleId) {
        return await this.User.findOne({
            where: { googleId },
            attributes: getUnselectData(['password']),
            raw: true
        });
    }

    async updatePassword(id, password) {
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
    async incrementBalance(userId, amount, options = {}) {
        return await this.User.increment(
            { balance: amount },
            { where: { id: userId }, ...options }
        )
    }
    async findAllMember(ShopId) {
        return this.ShopUserRole.findAll({
            where: {
                ShopId,
                status:'active',
            },
            include: [
                {
                    model: this.User, as: 'user', attributes: ["id", 'name', 'email', 'avatar']
                },
                {
                    model:this.Roles,
                    as:"role",
                    attributes:['id', 'role_name']
                }
            ],
            order: [["joinedAt", "ASC"]]
        })
    }
    async findShopUserRoleById(ShopId,UserId){
        return this.ShopUserRole.findOne({where:{ShopId, UserId}})
    }   
    async createNewShopUserRole(ShopId, UserId, RoleId){
        return this.ShopUserRole.create({
            ShopId,
            UserId,
            RoleId,
            status:'active'
        })
    }
    async findAllRole(){
        console.log("repository")
        return this.Roles.findAll({where:{role_name:{[Op.notIn]:['superadmin', 'seller']}}},{ attributes: ["id", "role_name", "role_desc"] })
    }
}

module.exports = UserRepository