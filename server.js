const app = require("./src/index")
const {closeRedis} = require("./src/db/rdb")
const PORT = 3000

const server = app.listen(PORT,()=>{
    console.log(`server is listening on port ${PORT}`)
}) 
process.on("SIGINT",async()=>{
    await closeRedis();
    server.close(()=>console.log('exit server'))
    process.exit(0)
})
