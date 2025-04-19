const bannerRepo = require("../models/repositories/banner.repo")

class BannerService {
    static async getListBanner(){
        return await bannerRepo.getListBanner()
    }
}

module.exports = BannerService