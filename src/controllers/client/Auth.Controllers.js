const {CreatedResponse, SuccessResponse, OkResponse} = require("../../cores/success.response")
const AuthService = require("../../services/client/Auth.Service")
class AuthController{
    login = async (req, res, next) => {
        new OkResponse({
            message:"login success",
            metadata: await AuthService.login(req.body)
        }).send(res)
    }
    loginWithGoogle = async(req, res, next)=>{
        console.log("login with google")
        new OkResponse({
            message:'login with Google success',
            metadata: await AuthService.loginWithGoogle(req.body)
        }).send(res)
    }
    logout = async(req,res,next)=>{
        new OkResponse({
            message:"logout sucsess",
            metadata:await AuthService.logout(req.headers['x-rtoken-id'])
        }).send(res)
    }
    handleRefreshToken = async(req, res, next)=>{
        new OkResponse({
            message:"refresh token sucess",
            metadata: await AuthService.handleRefreshToken(
                req.refreshToken
            )
        }).send(res)
    }
    signup = async(req,res, next)=>{
        new OkResponse({
            message:'sign up success',
            metadata: await AuthService.signUp(req.body)
        }).send(res)
    }
    forgotPassword = async(req,res, next)=>{
        const email= req.body.email
        new OkResponse({
            message:"get Otp code successfully",
            metadata: await AuthService.forgotPassword(email)
        }).send(res)
    }
    linkGoogle = async(req, res, next)=>{
        new OkResponse({
            message:"link to google successfully",
            metadata: await AuthService.linkGoogle(req.body)
        }).send(res)
    }
    checkOtp = async(req, res, next)=>{
        const otp = req.body.otp
        new OkResponse({
            message:"Otp code is correct",
            metadata:await AuthService.checkOtp(otp)
        }).send(res)
    }
    changePassword = async(req,res, next)=>{
        const {resetToken, newPassword,confirmedPassword} = req.body
        new OkResponse({
            message:"Change Password successfull",
            metadata:await AuthService.changePassword({resetToken,newPassword, confirmedPassword})
        }).send(res)
    }
    updateFcmToken = async(req, res, next)=>{
        const userId = req.userId
        const fcmToken = req.body.fcmToken
        new OkResponse({
            message:"Fcm token updated",
            metadata:await AuthService.updateFcmToken({userId,fcmToken})
        }).send(res)
    }  
}

module.exports = new AuthController()