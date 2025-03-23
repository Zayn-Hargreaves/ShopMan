const initializeModels = require("../db/dbs/associations");
const { getUnselectData } = require("../src/utils");

class UserService{
    static async findByEmail(email){
        const {User} = await initializeModels()
        return await User.findOne({
            where:{
                email
            },
            attributes:getUnselectData(['password'])
        })
    }
    static async findById(id){
        const {User} = await initializeModels()
        return await User.findByPk(id,{
            attributes:getUnselectData(['password'])
        })
    }
}

module.exports = UserService