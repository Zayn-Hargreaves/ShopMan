const initializeModels = require("../../db/dbs/associations")
class CategoryRepository {
    constructor(models){
        this.Category = models.Category
    }
    async getAllCategoriesNoParent() {
        return this.Category.findAll({
            where: {
                ParentId: null
            }
        })
    }
    async findCategoryBySlug(slug) {
        return this.Category.findOne({
            where: {
                slug: slug
            }
        })
    }
    // async getProductByCategorySlug(slug){
    //     return Category.findAll({
    //         where:{
    //             slug:slug
    //         },
    //         include:
    //     })
    // }
}

module.exports =CategoryRepository