const { OkResponse } = require("../cores/success.response")
const UserService = require("../services/User.Service")

class UserController{
    getUserProfile= async(req, res,next)=>{
        const userId = req.userId
        new OkResponse({
            message:"get user profile successfully",
            metadata: await UserService.getUserProfile(userId)
        }).send(res)
    }
    updateUserProfile = async(req, res, next)=>{
        const userId = req.userId
        const {User, Address} = req.body

        new OkResponse({
            message:"update user profile successfully",
            metadata: await UserService.updateUserProfile(userId,{User, Address})
        }).send(res)
    }
    addUserAddress = async(req, res,next)=>{
        const userId = req.userId
        const {address_type, pincode, address, city, country} = req.body
        const Address = {address_type, pincode, address, city, country}
        new OkResponse({
            message:"add user address success",
            metadata : await UserService.addUserAddress(userId, {Address})
        }).send(res)
    }
    getUserAddress = async(req, res, next)=>{
        const userId = req.userId
        
        new OkResponse({
            message:"get user address success",
            metadata: await UserService.getUserAddress(userId)
        }).send(res)
    }
}

module.exports = new UserController()