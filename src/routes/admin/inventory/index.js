const express = require("express");
const router = express.Router();
const { checkShop, checkPermission, checkShopActive } = require("../../../auth/authUtils");
const inventoryController = require('../../../controllers/admin/inventory.controller');
const { asyncHandler } = require('../../../helpers/asyncHandler');

/**
 * @swagger
 * tags:
 *   - name: Admin - Inventory
 *     description: Quản lý tồn kho sản phẩm trong từng shop
 */

/**
 * @swagger
 * /api/v1/admin/{ShopId}/inventory/all:
 *   get:
 *     tags: [Admin - Inventory]
 *     summary: Lấy danh sách tồn kho toàn bộ shop
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ShopId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của Shop
 *       - in: query
 *         name: skuId
 *         schema:
 *           type: string
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: minQty
 *         schema:
 *           type: integer
 *       - in: query
 *         name: maxQty
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lấy danh sách tồn kho thành công
 */
router.get(
  '/all',
  checkPermission('inventory', 'read:all'),
  checkShopActive,
  asyncHandler(inventoryController.listInventories)
);

/**
 * @swagger
 * /api/v1/admin/{ShopId}/inventory/{AdminShopId}:
 *   get:
 *     tags: [Admin - Inventory]
 *     summary: Lấy danh sách tồn kho theo shop cụ thể
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ShopId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: AdminShopId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lấy danh sách tồn kho theo shop thành công
 */
router.get(
  '/:AdminShopId',
  checkPermission('inventory', 'read:any'),
  checkShopActive,
  asyncHandler(inventoryController.listInventories)
);

/**
 * @swagger
 * /api/v1/admin/{ShopId}/inventory/{AdminShopId}/update/{inventoryId}:
 *   patch:
 *     tags: [Admin - Inventory]
 *     summary: Cập nhật thông tin tồn kho
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ShopId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: AdminShopId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: inventoryId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 20
 *               location:
 *                 type: string
 *                 example: "Kho số 2"
 *     responses:
 *       200:
 *         description: Cập nhật tồn kho thành công
 */
router.patch(
  '/:AdminShopId/update/:inventoryId',
  checkPermission('inventory', 'update:any'),
  checkShopActive,
  asyncHandler(inventoryController.updateInventory)
);

module.exports = router;
