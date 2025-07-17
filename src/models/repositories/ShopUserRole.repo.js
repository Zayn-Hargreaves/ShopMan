class ShopUserRoleRepository{
    constructor(models){
        this.ShopUserRole = models.ShopUserRole
        this.Role = models.Roles
        this.Shop = models.Shop
    }
    async findOneRole(role_name){
        return await this.Role.findOne({where:{role_name}})
    }
    async createNewShopUserRole(UserId,ShopId,RoleId){
        return await this.ShopUserRole.create({UserId, ShopId,RoleId})
    }
    async checkSeller(UserId,RoleId){
        return await this.ShopUserRole.findOne({where:{UserId, RoleId}})
    }
    async findMemberShip(UserId, ShopId){
        return await this.ShopUserRole.findOne({
            where:{
                UserId,
                ShopId
            },
            include:[
                {
                    model:this.Role,
                    as:"role",
                    attribute:['role_name']
                },
                {
                    model:this.Shop,
                    as:'shop',
                    attribute:['status']
                }
            ]
        })
    }
}


module.exports = ShopUserRoleRepository