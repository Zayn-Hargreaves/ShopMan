    const { checkShop, checkPermission, checkShopActive } = require("../../../auth/authUtils");
const memberController = require("../../../controllers/admin/member.controller");
const { asyncHandler } = require("../../../helpers/asyncHandler");

const router = require("express").Router();

router.get('/roles', checkPermission('role', 'read:any'), checkShopActive,asyncHandler(memberController.listRoles)); 
router.post('/invite/:AdminShopId', checkPermission('shop', 'create:any'), checkShopActive,asyncHandler(memberController.inviteMember)); 
router.patch('/role/:AdminShopId/:userId', checkPermission('shop', 'update:any'), checkShopActive,asyncHandler(memberController.changeRole));
router.get('/:AdminShopId', checkPermission('shop', 'read:any'), checkShopActive,asyncHandler(memberController.listMembers)); 
router.get("/:AdminShopId/details/:userId",checkPermission("shop",'read:any'), checkShopActive, asyncHandler(memberController.getMemberDetail))
router.delete('/:AdminShopId/remove-member/:userId',checkPermission('shop', 'delete:any'),checkShopActive ,asyncHandler(memberController.removeMember)); 

module.exports = router;
