const {CreatedResponse, SuccessResponse, OkResponse} = require("../../cores/success.response")
const AuthService = require("../../services/Auth.Service")
class AuthController{
    login = async (req, res, next) => {
        new OkResponse({
            message:"login success",
            metadata: await AuthService.login(req.body)
        }).send(res)
    }
    loginWithGoogle = async(req, res, next)=>{
        new OkResponse({
            message:'login with Google success',
            metadata: await AuthService.loginWithGoogle(req.body)
        }).send(res)
    }
    logout = async(req,res,next)=>{
        new OkResponse({
            message:"logout sucsess",
            metadata:await AuthService.logout(req.header)
        }).send(res)
    }
    handleRefreshToken = async(req, res, next)=>{
        new OkResponse({
            message:"refresh token sucess",
            metadata: await AuthService.handleRefreshToken({
                refreshToken:req.header,
            })
        }).send(res)
    }
    signup = async(req,res, next)=>{
        new OkResponse({
            metadata: await AuthService.signUp(req.body)
        }).send(res)
    }
    signUpWithGoogle = async(req, res,next)=>{
        new OkResponse({
            message:'signUp with Google successfully',
            metadata: await AuthService.signUpWithGoogle(req.body)
        }).send(res)
    }
}

module.exports = new AuthController()