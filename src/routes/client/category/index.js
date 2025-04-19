const router = require("express").Router();
const { asyncHandler } = require("../../../helpers/asyncHandler");
const categoryController = require("../../../controllers/Category.Controller");
const SearchController = require("../../../controllers/Search.Controller")

router.get("/", asyncHandler(categoryController.getAllCategoriesNoParent));
router.get('/:slug/product', asyncHandler(SearchController.getProductByCategory));


module.exports = router;