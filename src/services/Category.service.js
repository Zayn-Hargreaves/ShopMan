const initializeModels = require("../db/dbs/associations")
const categoryRepo = require("../models/repositories/category.repo")
class CategoryService{
    static async GetListCategory(){
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
    static async getCategoryDetail(slug,{page = 1,limit = 10, sort,minPrice, maxPrice,minRating, variation}){
        const {Category} = initializeModels()
        const offset =(page -1 ) * limit
        const whereClause={id:null}
        const productWhereClause = {}
        if(minPrice||maxPrice){
            productWhereClause.price ={}
            if(minPrice) productWhereClause.price[Op.gte] = parseFloat(minPrice)
            if(maxPrice) productWhereClause.price[Op.lte] = parseFloat(maxPrice)
        }
        if(minRating){
            productWhereClause.rating = {[Op.gte]:parseFloat(minRating)}
        }
        if(variation){
            productWhereClause.variation = variation
        }
        let orderClause = []
        if(sort){
            if(sort === 'price-asc') orderClause.push(['price', 'ASC'])
            if(sort ==='price-desc') orderClause.push(['price', "DESC"])
            if(sort ==="rating-asc") orderClause.push(['rating','ASC'])
            if(sort === 'rating-desc') orderClause.push(['rating','DESC'])
            if(sort === 'name-asc') orderClause.push("name", 'ASC')
            if(sort === 'name-desc') orderClause.push('name', 'DESC')
        }
        const category = await categoryRepo.findCategoryBySlug(slug)
        if(!category){
            throw new NotFoundError("Category not found")
        }
        whereClause.id=category.id
        
        return 
    }
    static async changeStatus(){
        // thay doi trang thai cua danh muc
    }
}

module.exports = CategoryService