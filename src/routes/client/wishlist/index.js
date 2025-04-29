const router = require("express").Router();
const { asyncHandler } = require("../../../helpers/asyncHandler");
const wishlistController = require("../../../controllers/Wishlist.Controller.js");

router.get("/", asyncHandler(wishlistController.getProductInWishlist));

router.post("/", asyncHandler(wishlistController.addProductToWishlist));

router.delete("/:productId", asyncHandler(wishlistController.removeProductFromWishlist));

router.delete("/", asyncHandler(wishlistController.removeAllProductFromWishlist));

router.get("/count", asyncHandler(wishlistController.getCountProductInWishlist));


module.exports = router;
