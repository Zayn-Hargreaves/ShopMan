const { getClient } = require("../edb")

const createUserEventIndex = async()=>{
    const client = await getClient()
    await client.indices.create({
        index:"user_event",
        body:{
            mappings:{
                properties:{
                    event_type:{type:'keyword'},
                    user_id:{type:'integer'},
                    product_id:{type:'integer'},
                    timestamp:{type:'date'},
                }
            }
        }
    })
}
const trackUserEvent = async(event)=>{
    const client = await getClient()
    await client.index({
        index:'user_events',
        body:event
    })
}

module.exports = {createUserEventIndex}