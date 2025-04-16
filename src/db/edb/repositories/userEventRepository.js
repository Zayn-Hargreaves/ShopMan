const { getClient } = require("../edb");

class UserEventRepository{
    async trackUserEvent (event){
        const client = getClient()
        await client.index({
            index:'user_events',
            body:event
        })
    }
}

module.exports = new UserEventRepository()