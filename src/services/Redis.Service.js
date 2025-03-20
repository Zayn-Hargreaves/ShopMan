const redisClient = require("../db/rdb")
class RedisService{
    static async createRedisBloomFilter(filterName, falsePositiveRate, capacity){
        return await redisClient.bf.reserver(filterName,falsePositiveRate,capacity)
    }
    static async addElementToRedisBloomFilter(filterName, value, falsePositiveRate = 0.01, capacity=1000){
        const exist = await redisClient.exist(filterName)
        
        if(!exist){
            await this.createRedisBloomFilter(filterName, falsePositiveRate, capacity)
        }
        return await redisClient.bf.add(filterName, value)
    }
    static async checkElementExistInRedisBloomFilter(filterName, value){
        return await redisClient.bf.add(filterName,value)
    }
    static async addMultiElementToRedisBloomFilter(filterName, Elements = []){
        return await redisClient.bf.mAdd(filterName, Elements)
    }
    static async checkMultiElementExistInRedisBloomFilter(filterName, Elements = []){
        return await redisClient.bf.mExist(filterName,Elements)
    }
}

module.exports = RedisService