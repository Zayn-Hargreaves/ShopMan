const { OkResponse } = require("../cores/success.response")
const UserService = require("../services/User.Service")

class UserController{
    getUserProfile= async(req, res,next)=>{
        const {userId} = req.userId
        new OkResponse({
            message:"get user profile successfully",
            metadata: await UserService.getUserProfile(userId)
        }).send(res)
    }
    updateUserProfile = async(req, res, next)=>{
        const {userId} = req.userId
        const {User, Address} = req.body
        new OkResponse({
            message:"update user profile successfully",
            metadata: await UserService.updateUserProfile(userId,{User, Address})
        }).send(res)
    }
}

module.exports = new UserController()