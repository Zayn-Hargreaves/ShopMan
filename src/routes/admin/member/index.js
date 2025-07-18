    const { checkShop, checkPermission, checkShopActive } = require("../../../auth/authUtils");
const memberController = require("../../../controllers/admin/member.controller");
const { asyncHandler } = require("../../../helpers/asyncHandler");

const router = require("express").Router();

/**
 * @swagger
 * tags:
 *   - name: Admin - Shop Members
 *     description: Quản lý thành viên cửa hàng (Admin hoặc Chủ shop)

 * components:
 *   schemas:
 *     InviteMemberRequest:
 *       type: object
 *       required: [email, roleId]
 *       properties:
 *         email:
 *           type: string
 *           example: "nhanvien@example.com"
 *         roleId:
 *           type: integer
 *           example: 3
 *     ChangeRoleRequest:
 *       type: object
 *       required: [roleId]
 *       properties:
 *         roleId:
 *           type: integer
 *           example: 4
 *     MemberResponse:
 *       type: object
 *       properties:
 *         userId:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         avatar:
 *           type: string
 *         roleId:
 *           type: integer
 *         role:
 *           type: string
 *         joinedAt:
 *           type: string
 *         status:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/admin/{ShopId}shop/{AdminShopId}/member/roles:
 *   get:
 *     tags: [Admin - Shop Members]
 *     summary: Lấy danh sách vai trò khả dụng trong cửa hàng
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: ShopId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *       - name: AdminShopId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *       - $ref: '#/components/parameters/AccessTokenHeader'
 *     responses:
 *       200:
 *         description: Danh sách vai trò
 */

/**
 * @swagger
 * /api/v1/admin/{ShopId}shop/{AdminShopId}/member/invite:
 *   post:
 *     tags: [Admin - Shop Members]
 *     summary: Mời thành viên mới vào cửa hàng
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: ShopId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *       - name: AdminShopId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *       - $ref: '#/components/parameters/AccessTokenHeader'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InviteMemberRequest'
 *     responses:
 *       200:
 *         description: Mời thành viên thành công
 */

/**
 * @swagger
 * /api/v1/admin/{ShopId}shop/{AdminShopId}/member/role/{userId}:
 *   patch:
 *     tags: [Admin - Shop Members]
 *     summary: Thay đổi vai trò thành viên
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: ShopId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *       - name: AdminShopId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *       - name: userId
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *       - $ref: '#/components/parameters/AccessTokenHeader'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangeRoleRequest'
 *     responses:
 *       200:
 *         description: Cập nhật vai trò thành công
 */

/**
 * @swagger
 * /api/v1/admin/{ShopId}shop/{AdminShopId}/member:
 *   get:
 *     tags: [Admin - Shop Members]
 *     summary: Lấy danh sách thành viên trong cửa hàng
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: ShopId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *       - name: AdminShopId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *       - $ref: '#/components/parameters/AccessTokenHeader'
 *     responses:
 *       200:
 *         description: Danh sách thành viên trong shop
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MemberResponse'
 */

/**
 * @swagger
 * /api/v1/admin/{ShopId}shop/{AdminShopId}/member/details/{userId}:
 *   get:
 *     tags: [Admin - Shop Members]
 *     summary: Lấy chi tiết thông tin thành viên
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: ShopId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *       - name: AdminShopId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *       - name: userId
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *       - $ref: '#/components/parameters/AccessTokenHeader'
 *     responses:
 *       200:
 *         description: Thông tin chi tiết thành viên
 */

/**
 * @swagger
 * /api/v1/admin/{ShopId}shop/{AdminShopId}/member/remove-member/{userId}:
 *   delete:
 *     tags: [Admin - Shop Members]
 *     summary: Xoá thành viên ra khỏi cửa hàng
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: ShopId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *       - name: AdminShopId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *       - name: userId
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *       - $ref: '#/components/parameters/AccessTokenHeader'
 *     responses:
 *       200:
 *         description: Thành viên đã bị xoá
 */

router.get('/roles', checkPermission('role', 'read:any'), checkShopActive,asyncHandler(memberController.listRoles)); 
router.post('/invite/:AdminShopId', checkPermission('shop', 'create:any'), checkShopActive,asyncHandler(memberController.inviteMember)); 
router.patch('/role/:AdminShopId/:userId', checkPermission('shop', 'update:any'), checkShopActive,asyncHandler(memberController.changeRole));
router.get('/:AdminShopId', checkPermission('shop', 'read:any'), checkShopActive,asyncHandler(memberController.listMembers)); 
router.get("/:AdminShopId/details/:userId",checkPermission("shop",'read:any'), checkShopActive, asyncHandler(memberController.getMemberDetail))
router.delete('/:AdminShopId/remove-member/:userId',checkPermission('shop', 'delete:any'),checkShopActive ,asyncHandler(memberController.removeMember)); 

module.exports = router;
