const { NotFoundError } = require("../../cores/error.response")
const initializeModels = require("../../db/dbs/associations")
const categoryRepo = require("../../models/repositories/category.repo")
const RepositoryFactory = require("../../models/repositories/repositoryFactory") 
const RedisService = require("./Redis.Service")
class CategoryService{
    static async getAllCategoriesNoParent(){
        await RepositoryFactory.initialize()
        const categoryRepo = RepositoryFactory.getRepository("CategoryRepository")
        const cacheKey = `category-no-parent:`
        let result = await RedisService.getCachedData(cacheKey)
        if(!result){
            result = await categoryRepo.getAllCategoriesNoParent()
            if(!result){
                await RedisService.cacheData(cacheKey,[],300)
                throw new NotFoundError("Category not found")
            }
            await RedisService.cacheData(cacheKey,result,3600)
        }
        return result
    }
    
}

module.exports = CategoryService