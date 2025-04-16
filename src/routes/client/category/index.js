const router = require("express").Router();
const { asyncHandler } = require("../../../helpers/asyncHandler");
const categoryController = require("../../../controllers/Category.Controller");


router.get("/", asyncHandler(categoryController.getAllCategoriesNoParent));

module.exports = router;