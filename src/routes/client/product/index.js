const router = require('express').Router();
const SearchController = require('../../../controllers/Search.Controller');
const { asyncHandler } = require('../../../helpers/asyncHandler');
const ProductController = require('../../../controllers/Product.Controller');


router.get('/', asyncHandler(SearchController.getProductList));

router.get('/detail/:slug', asyncHandler(ProductController.getProductDetail));

router.get('/search', asyncHandler(SearchController.SearchProducts));

router.get("/deal-of-the-day", asyncHandler(ProductController.getDealOfTheDay));

router.get("/all-deal-product", asyncHandler(ProductController.getAllDealProduct))

router.get("/trending-products", asyncHandler(ProductController.getTrendingProducts));

router.get('/all-trending-products',asyncHandler(ProductController.getAllTrendingProduct))

router.get("/new-arrivals", asyncHandler(ProductController.getNewArrivals));


module.exports = router;