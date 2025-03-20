// lv3
// const {createClient } = require("redis")
// const config = require("../config/index")

// class Redis{
//     constructor(){
//         this.connect()
//     }
//     connect(type="redis"){
//         let rdbConfig = config.redis;
//         this.redisClient = createClient({
//             url:rdbConfig.url
//         })
//         this.redisClient.on("error",(error)=>{
//             console.log("Error redis connection::", error)
//         })
//         this.redisClient.connect()
//             .then(()=>{
//                 console.log("Connected to redis successfully")
//             })
//             .catch((err)=>{
//                 console.log("Error Database Connection::",err)
//             })
//     }
//     static getInstance(){
//         if(!Redis.instance){
//             Redis.instance = new Redis()
//         }
//         return Redis.instance
//     }
// }

// const instanceRedis = Redis.getInstance()
// module.exports = instanceRedis; 


// connect to redis level 2.5 voi co che retry

// const redis = require("redis");
// const { InternalServerError } = require("../cores/error.response");
// let client = {}, statusConnectRedis = {
//     CONNECT:"connect",
//     END:"end",
//     RECONNECT:"reconnecting",
//     ERROR:'error'
// }

// const REDIS_CONNECT_TIMEOUT = 10000, REDIS_CONNECT_MESSAGE ={
//     code:-99,
//     message:{
//         vn:'redis loi',
//         en:"an error orcur with redis"
//     }
// }
// const handleTimeOutError = ()=>{
//     connectionTimeOut = setTimeout(() => {
//         throw new InternalServerError("loi redis")
//     }, REDIS_CONNECT_TIMEOUT);
// }
// const handleEventConnect = ({
//     connectionRedis
// })=>{
//     connectionRedis.on(statusConnectRedis.CONNECT,()=>{
//         console.log(`connecttionRedis - Connection status:connected`)
//         clearTimeout(connectionTimeOut)
//     })
//     connectionRedis.on(statusConnectRedis.END,()=>{
//         console.log(`connecttionRedis - Connection status:end`)
//         handleTimeOutError()
//     })
//     connectionRedis.on(statusConnectRedis.ERROR,()=>{
//         console.log(`connecttionRedis - Connection status:disconnected`)
//         handleTimeOutError()

//     })
//     connectionRedis.on(statusConnectRedis.RECONNECT,()=>{
//         console.log(`connecttionRedis - Connection status:reconnecting`)
//         clearTimeout(connectionTimeOut)
//     })
// }
// const initRedis = ()=>{
//     const instanceRedis = redis.createClient()
//     client.instanceConnect = instanceRedis
//     handleEventConnect({connectionRedis:instanceRedis})
// }
// // nen de o file constance
// const getRedis = ()=> client

// const closeRedis = ()=>{
//     //// chua biet trien khai nhu nao
// }

// module.exports ={
//     initRedis,
//     getRedis,
//     closeRedis  
// }

const Redis = require("ioredis")
const config = require("../config/index")
const { InternalServerError } = require("../../cores/error.response");

const REDIS_CONFIG = {
    singleNode: {
        username: config.redis.username,
        password: config.redis.password,
        host: config.redis.host,
        port: config.redis.port,
        url: config.redis.url
    },
    clusterNodes: {
        // { host: "localhost", port: 6379 },
        // { host: "localhost", port: 6380 },
    },
    options: {
        maxRetriesPerRequest: 5,
        retryStrategy: (times) => {
            return Math.min(times * 1000, 5000);
        },
        reconnectOnError: (err) => {
            const targetErrors = ['READONLY', 'ECONNRESET'];
            return targetErrors.some((e) => err.message.includes(e));
        },
        connectionPoolSize: 10,
    },
    timeout: 10000
}
class RedisManager {
    constructor() {
        this.client = null;
        this.isClusterMode = false;
        this.initializeRedis();
    }
    async initializeRedis() {
        try {
            if (this.isClusterMode && REDIS_CONFIG.clusterNodes.length() > 0) {
                this.client = new Redis.Cluster(REDIS_CONFIG.clusterNodes, {
                    redisOptions: REDIS_CONFIG.options,
                    clusterRetryStrategy: REDIS_CONFIG.clusterRetryStrategy
                })
                console.log("Initializing Redis in Cluster mode...")
            } else {
                this.client = new Redis({
                    ...REDIS_CONFIG.singleNode,
                    ...REDIS_CONFIG.options
                })
                console.log("Initializing Redis in Single mode...")
            }
            this.attachEventHandlers();
            await this.waitForConnection();
            console.log("Redis connected successfully")
        } catch (error) {
            console.error("Redis initialization failed:", err)
            throw new InternalServerError("Failed to initialize Redis connection")
        }
    }

    attachEventHandlers() {
        this.client.on("connect", () => {
            console.log("Redis - Connection status: connected");
        });

        this.client.on("ready", () => {
            console.log("Redis - Connection status: ready");
        });

        this.client.on("error", (err) => {
            console.error("Redis - Connection status: error -", err.message);
        });

        this.client.on("reconnecting", () => {
            console.log("Redis - Connection status: reconnecting");
        });

        this.client.on("end", () => {
            console.log("Redis - Connection status: end");
        });
    }

    async waitForConnection(){
        return Promise.race([
            this.client.status === 'ready' ? Promise.resolve(): new Promise((resolve)=>{ this.client.once("ready", resolve)}),
            new Promise ((_,reject)=>{
                setTimeout(()=>reject(new Error("Redis connection timeout")),REDIS_CONFIG.timeout)
            })
        ])
    }
    getClient(){
        if(!this.client || this.client.status === 'end'){
            throw new InternalServerError("Redis client not available")
        }
        return this.client
    }
    async close(){
        if(this.client){
            await this.client.quit();
            console.log("Redis connection closed gracefully")
            this.client = null
        }
    }
    static getInstance(){
        if(!RedisManager.instance){
            RedisManager.instance = new RedisManager()
        }
        return RedisManager.instance
    }
}

const redisManager = RedisManager.getInstance()
module.exports = {
    initRedis:async()=>{
        await redisManager.initializeRedis()
        return redisManager
    },
    getRedis:async()=>redisManager.getClient(),
    closeRedis:async()=>redisManager.close()
}