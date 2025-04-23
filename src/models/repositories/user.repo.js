const initializeModels = require("../../db/dbs/associations");
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
            raw:true
        });
    }

    async findById(id) {
        return await this.User.findByPk(id, {
            attributes: getUnselectData(['password']),
            raw:true
        });
    }
    
    async findByIdWithCart(id) {
        return await this.User.findByPk(id, {
            include: {
                model: this.Cart,
                as: 'cart'
            },
            attributes: getUnselectData(['password']),
            raw:true
        });
    }
    async getUserProfile(id){
        return await this.User.findOne({
            where: { id },
            attributes: getUnselectData(['password']),
            include: {
                model: this.Address,
                as: 'address',
                where:{
                    address_type:'Main',
                },
                required: false,
                raw:true
            }
        })
    }
    async findByGoogleId(googleId) {
        return await this.User.findOne({
            where: { googleId },
            attributes: getUnselectData(['password']),
            raw:true
        });
    }

    async updatePassword(id, password ) {
        console.log(id)
        console.log(password)
        return await this.User.update({ password: password }, { where: { id } });
    }

    async createUser({name, email, password = null, googleId= null , status = 'active' }) {
        return await this.User.create({ name, email, password, status,googleId });
    }
    async updateUserProfile(UserId,{name,phone, avatar}){
        return await this.User.update({
            name,
            phone,
            avatar,
        },{
            where:{
                id:UserId
            }
        })
    }
}

module.exports =UserRepository