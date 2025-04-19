const { OkResponse } = require("../cores/success.response")
const BannerService = require("../services/Banner.service")
class BannerController{
    getAllBanner = async(req,res,next)=>{
        new OkResponse({
            message:'get all banner success',
            metadata:await BannerService.getListBanner()
        }).send(res)
    }
}

module.exports =new BannerController()