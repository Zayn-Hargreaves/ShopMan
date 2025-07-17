const { checkShop, checkPermission, checkShopActive } = require("../../../auth/authUtils");
const productController = require('../../../controllers/admin/product.controller');
const { asyncHandler } = require('../../../helpers/asyncHandler');
const router = require('express').Router();




router.get('/all',
    checkPermission('product', 'read:all'),checkShopActive,
    asyncHandler(productController.listProducts)
);

router.get('/:AdminShopId',
    checkPermission('product', 'read:any'),checkShopActive,
    asyncHandler(productController.listProducts)
);

router.get("/:AdminShopId/productdetail/:ProductId",checkPermission("product","read:any"), checkShopActive,asyncHandler(productController.getProductDetail))
router.post('/:AdminShopId',
    checkPermission('product', 'create:any'),checkShopActive,
    asyncHandler(productController.addProduct)
);

router.put('/:AdminShopId/:productId',
    checkPermission('product', 'update:any'),checkShopActive,
    asyncHandler(productController.updateProduct)
);

router.delete('/:AdminShopId/:productId',
    checkPermission('product', 'delete:any'),checkShopActive,
    asyncHandler(productController.deleteProduct)
);

module.exports = router;
