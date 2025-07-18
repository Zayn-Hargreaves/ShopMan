const { NotFoundError } = require("../../cores/error.response")

class AddressRepository {
    constructor(models) {
        this.Address = models.Address
        this.User = models.User
    }
    async findById(id){
        return await this.Address.findByPk(id)
    }
    async findAddressByUserId({UserId, address_type = 'main'}) {
        return await this.Address.findOne({
            where: {
                UserId: UserId,
                address_type: address_type
            },
            raw:true
        })
    }
    async getListAddress(UserId) {
        return await this.Address.findAll({
            where: {
                UserId: UserId,
            }
        })
    }
    async createAddress({ UserId, address_type, pincode, address, city, country }) {
        const user = await this.User.findByPk(UserId)
        if(!user){
            throw new NotFoundError("User not found")
        }
        return await this.Address.create({
            UserId,
            address_type,
            pincode,
            address,
            city,
            country
        })
    }
    async updateUserAddress(UserId,{pincode, address, city, country }) {
         const user = await this.User.findByPk(UserId)
        if(!user){
            throw new NotFoundError("User not found")
        }
        return await this.Address.update({
            pincode,
            address,
            city,
            country,
        }, {
            where: {
                UserId: UserId,
                address_type :'main'
            }
        })
    }
}

module.exports = AddressRepository