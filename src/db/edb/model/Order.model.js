const {getClient} = require("../edb")
const createOrderIndex = async()=>{
    const client = await getClient()
    await client.indices.create({
        index:'orders',
        body:{
            mappings:{
                properties:{
                    id:{type:'integer'},
                    UserId:{type:'integer'},
                    order_totalPrice:{type:'float'},
                    order_status:{type:'keyword'},
                    createAt:{type:'date'},
                    updateAt:{type:'date'},
                    order_details:{
                        type:'nested',
                        properties:{
                            product_id:{type:'integer'},
                            quantity:{type:'integer'},
                            price_at_time:{type:'float'}
                        }
                    }
                }
            }
        }
    })
}

module.exports = {createOrderIndex}