const RepositoryFactory = require("../../models/repositories/repositoryFactory");
const { retry } = require("../../helpers/retryFuntion");
const EmailService = require("../client/Email.service");
const { ConflictError, NotFoundError } = require("../../cores/error.response");
const NotfiticationService = require("../client/Notification.service");
const { getInfoData } = require("../../utils");
class MemberService {
    // Lấy danh sách thành viên shop
    static async listMembers(shopId) {
        await RepositoryFactory.initialize();
        const UserRepo = RepositoryFactory.getRepository("UserRepository");

        // Tìm all members
        const members = await UserRepo.findAllMember(shopId)

        return members.map(m => ({
            userId: m.UserId,
            name: m.user?.name,
            email: m.user?.email,
            avatar: m.user?.avatar,
            roleId: m.RoleId,
            role: m.role?.role_name,
            joinedAt: m.joinedAt,
            status: m.status,
        }));
    }

    // Mời thành viên mới
    static async inviteMember(shopId, { email, roleId }) {
        await RepositoryFactory.initialize();
        const UserRepo = RepositoryFactory.getRepository("UserRepository");
        const ShopUserRoleRepo = RepositoryFactory.getRepository("ShopUserRoleRepository");
        const NotificationRepo = RepositoryFactory.getRepository("NotificationRepository")
        let user = await UserRepo.findByEmail(email);
        if (!user) {
            throw new ConflictError('User not found, need registration');
        }

        // Check đã là thành viên chưa
        let member = await ShopUserRoleRepo.findMemberShip(user.id, shopId);
        if (member) throw new ConflictError('User already member of shop');

        // Tạo member mới (status: pending/active)
        await UserRepo.createNewShopUserRole(shopId, user.id, roleId)
        member = await ShopUserRoleRepo.findMemberShip(user.id, shopId);
        await NotfiticationService.sendNotification(user.id,"Invite member", `Bạn vừa được mời trở thành ${member?.role.role_name} tại shop ${member?.shop.name} trên hệ thống ShopMan.`)
        retry(async () =>
            await NotificationRepo.create({
                type: "invite member",
                option: "success",
                content: `Bạn vừa được mời trở thành ${member?.role.role_name} tại shop ${member?.shop.name} trên hệ thống ShopMan. Hãy chuyển sang giao diện quản lý để biết thêm chi tiết`,
                UserId: user.id,
                isRead: false,
                meta: {
                    page:'profile',
                    link: `/user/profile`
                }
            })
        ).catch(console.error);
        const emailService = new EmailService(user,null)
        retry(async()=>{
            await emailService.sendInviteShopMember("inviteShopMember",`Thư mời trở thành ${member?.role.role_name} tại shop ${member?.shop.name}`,{shopName:member?.shop.name, memberName:user.name,roleName:member?.role.role_name})
        })
        return member;
    }

    // Đổi vai trò
    static async changeRole(shopId, userId, newRoleId) {
        await RepositoryFactory.initialize();
        const UserRepo = RepositoryFactory.getRepository("UserRepository");
        const member = await UserRepo.findShopUserRoleById(shopId, userId)
        if (!member) throw new NotFoundError('Member not found');
        member.RoleId = newRoleId;
        await member.save();
        return member;
    }

    // Xoá member
    static async removeMember(shopId, userId) {
        await RepositoryFactory.initialize();
        const UserRepo = RepositoryFactory.getRepository("UserRepository");
        // Cứng: Xoá bản ghi, hoặc mềm: đổi status
        // await ShopUserRole.destroy({ where: { ShopId: shopId, UserId: userId } });
        const member = await UserRepo.findShopUserRoleById(shopId, userId)
        if (!member) throw new NotFoundError('Member not found');
        member.status = 'removed';
        await member.save();
        return { success: true };
    }
    static async getMemberDetail(shopId,userId){
        await RepositoryFactory.initialize()
        const UserRepo = RepositoryFactory.getRepository("UserRepository");
        const ShopUserRoleRepo =RepositoryFactory.getRepository("ShopUserRoleRepository")
        let member = await ShopUserRoleRepo.findMemberShip(userId,shopId)
        if (!member) throw new NotFoundError('Member not found');
        return  await UserRepo.getUserProfile(userId)
    }
    // Lấy danh sách vai trò khả dụng cho shop
    static async listRoles() {
        await RepositoryFactory.initialize();
        const UserRepo = RepositoryFactory.getRepository("UserRepository");
        // Nếu custom role cho shop: lọc thêm theo shopId
        // Nếu chỉ 1 set role chung toàn hệ thống:
        const roles = await UserRepo.findAllRole();
        return roles;
    }
}

module.exports = MemberService;
