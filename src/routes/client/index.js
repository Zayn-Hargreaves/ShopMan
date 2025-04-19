const router = require("express").Router()
const { authentication } = require("../../auth/authUtils");

router.use("/auth",require("../client/auth/index"))
router.use("/banner", require("../client/banner/index.js"))
router.use("/product",require("../client/product/index"))
router.use("/campaign", require("../client/campaign/index"))
router.use("/category",require("../client/category/index"))
router.use(authentication)
router.use("/wishlist",require("../client/wishlist/index"))
router.use("/cart",require("../client/cart/index.js"))
router.use("/user",require("../client/user/index"))

module.exports = router