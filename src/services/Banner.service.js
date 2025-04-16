const bannerRepo = require("../models/repositories/banner.repo")

class BannerService {
    static async getListBanner(){
        const currentDate = new Date()
        return await bannerRepo.getListBanner(currentDate)
    }
}

module.exports = BannerService