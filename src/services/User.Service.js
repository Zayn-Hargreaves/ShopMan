const User = require("../models/User.model");
const { getUnselectData } = require("../src/utils");

class UserService{
    static async findByEmail(email){
        return await User.findOne({
            where:{
                email
            },
            attributes:getUnselectData(['password'])
        })
    }
    static async findById(id){
        return await User.findByPk(id,{
            attributes:getUnselectData(['password'])
        })
    }
}

module.exports = UserService