const router = require("express").Router()
const { authentication } = require("../../auth/authUtils");

router.use("/auth",require("../client/auth/index"))
router.use("/banner", require("../client/banner/index.js"))
router.use("/product",require("../client/product/index"))
router.use("/campaign", require("../client/campaign/index"))
router.use("/category",require("../client/category/index"))
router.use("/shop",require("../client/shop/index.js"))
router.use("/comment", require("../client/comment"))
router.use("/payment-method", require("../client/paymentMethod/index.js"))
router.use(authentication)
router.use("/notification", require("../client/notification/index.js"))
router.use("/order", require("../client/order/index.js"))
router.use("/wishlist",require("../client/wishlist/index"))
router.use("/cart",require("../client/cart/index.js"))
router.use("/user",require("../client/user/index"))
router.use("/checkout", require("../client/checkout"))


module.exports = router