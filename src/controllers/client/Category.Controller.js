const { OkResponse } = require("../../cores/success.response");
const categoryService = require("../../services/client/Category.service");
class CategoryController{
    async getAllCategoriesNoParent(req,res, next){
        new OkResponse({
            message:"get all categories no parent successfully",
            metadata: await categoryService.getAllCategoriesNoParent()
        }).send(res)
    }
}

module.exports = new CategoryController()