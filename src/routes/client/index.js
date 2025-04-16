const router = require("express").Router()
const { authentication } = require("../../auth/authUtils");

router.use("/auth",require("../client/auth/index"))
router.use("/product",require("../client/product/index"))

router.use(authentication)
router.use("/user",require("../client/user/index"))

module.exports = router