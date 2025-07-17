const MemberService = require("../../services/admin/Member.Service.js")
const { OkResponse } = require("../../cores/success.response")

class MemberController {
    listMembers = async (req, res, next) => {
        new OkResponse({
            message: "List members success",
            metadata: await MemberService.listMembers(req.params.AdminShopId)
        }).send(res);
    }
    inviteMember = async (req, res, next) => {
        new OkResponse({
            message: "Invite member success",
            metadata: await MemberService.inviteMember(req.params.AdminShopId, req.body)
        }).send(res);
    }
    changeRole = async (req, res, next) => {
        new OkResponse({
            message: "Change member role success",
            metadata: await MemberService.changeRole(req.params.AdminShopId, req.params.userId, req.body.roleId)
        }).send(res);
    }
    removeMember = async (req, res, next) => {
        new OkResponse({
            message: "Remove member success",
            metadata: await MemberService.removeMember(req.params.AdminShopId, req.params.userId)
        }).send(res);
    }
    listRoles = async (req, res, next) => {
        new OkResponse({
            message: "List shop roles success",
            metadata: await MemberService.listRoles()
        }).send(res);
    }
    getMemberDetail= async(req, res, next)=>{
        new OkResponse({
            message:"Get member detail success",
            metadata:await MemberService.getMemberDetail(req.params.AdminShopId,req.params.userId)
        }).send(res)
    }
}

module.exports = new MemberController();
