const initializeModels = require("../db/dbs/associations")
const categoryRepo = require("../models/repositories/category.repo")
class CategoryService{
    static async getAllCategoriesNoParent(){
        return await categoryRepo.getAllCategoriesNoParent()
    }
    
    static async GetCategoryTree(){
        // lay cay thu muc
    }
    static async createCategory(){
        // them danh muc
    }
    static async editCategory(){
        // sua danh muc
    }
    
    static async changeStatus(){
        // thay doi trang thai cua danh muc
    }
}

module.exports = CategoryService