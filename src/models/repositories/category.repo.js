const initializeModels = require("../../db/dbs/associations")
class CategoryRepository {
    constructor(models) {
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
    async getAllCategories() {
        return this.Category.findAll({ attributes: ['id', 'parentId'] })
    }
    async findOneCategoryById(id,options){
        return this.Category.findOne({where:{id},...options})
    }
    async getAllDescendantCategoryIds(categoryId) {
        const result = new Set();
        const Category = this.Category
        // Tìm đệ quy
        async function dfs(currentId) {
            result.add(currentId);

            const children = await Category.findAll({
                where: { ParentId: currentId },
                attributes: ['id']
            });

            for (const child of children) {
                await dfs(child.id);
            }
        
        }

        await dfs(categoryId);
        return Array.from(result);
    }
}

module.exports = CategoryRepository