class RoleGrantRepository {
    constructor(models) {
        this.RoleGrant = models.RoleGrants
        this.Resource  = models.Resource
    }
    async findAllRoleGrant(RoleId) {
        return this.RoleGrant.findAll(
            {
                where: { RoleId },
                include: [{
                    model:this.Resource,
                    as:'resource',
                    attributes:['name']
                }],
            }

        )
    }
}

module.exports = RoleGrantRepository