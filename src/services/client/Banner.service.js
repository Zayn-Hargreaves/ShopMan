const RepositoryFactory = require("../../models/repositories/repositoryFactory")
class BannerService {
    static async getListBanner(){
        await RepositoryFactory.initialize()
        const bannerRepo = RepositoryFactory.getRepository("BannerRepository")
        return await bannerRepo.getListBanner()
    }
}

module.exports = BannerService