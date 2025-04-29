const { NotFoundError } = require('../cores/error.response')
const addressRepo = require('../models/repositories/address.repo')
const UserRepository = require('../models/repositories/user.repo')
const RepositoryFactory = require("../models/repositories/repositoryFactory")
class UserService{
    static async getUserProfile(UserId){
        await RepositoryFactory.initialize()
        const UserRepo = RepositoryFactory.getRepository('UserRepository')
        console.log(UserId)
        const user = await UserRepo.getUserProfile(UserId)
        if(!user){
            throw new NotFoundError("User not found")
        }
        return user
    }
    static async updateUserProfile(UserId,{User,Address}){
        await RepositoryFactory.initialize()
        const UserRepo = RepositoryFactory.getRepository('UserRepository')
        const addressRepo = RepositoryFactory.getRepository("AddressRepository")
        const user = await UserRepo.findById(UserId)
        if(!user){
            throw new NotFoundError("User not found")
        }
        await UserRepo.updateUserProfile(UserId,{...User})
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