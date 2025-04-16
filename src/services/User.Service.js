const { NotFoundError } = require('../cores/error.response')
const addressRepo = require('../models/repositories/address.repo')
const UserRepository = require('../models/repositories/user.repo')
class UserService{
    static async getUserProfile(UserId){
        const user = await UserRepository.getUserProfile(UserId)
        if(!user){
            throw new NotFoundError("User not found")
        }
    }
    static async updateUserProfile(UserId,{User,Address}){
        const user = await UserRepository.findUserById(UserId)
        if(!user){
            throw new NotFoundError("User not found")
        }
        await UserRepository.updateUserProfile(UserId,{...User})
        const existingAddress = await addressRepo.findAddressByUserId({UserId})
        if(!existingAddress){
            await addressRepo.createAddress({UserId,...Address})
        }else{
            await addressRepo.updateUserAddress(UserId,{...Address})
        }
        const updatedUser = await this.getUserProfile(UserId)
        return updatedUser
    }
}

module.exports = UserService