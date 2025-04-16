
const { getRedis } = require("../db/rdb");

class RedisService {
  static async createRedisBloomFilter(filterName, falsePositiveRate, capacity) {
    const redis = await getRedis();
    return await redis.call("BF.RESERVE", filterName, falsePositiveRate, capacity);
  }

  static async addElementToRedisBloomFilter(filterName, value, falsePositiveRate = 0.01, capacity = 1000) {
    const redis = await getRedis();
    const exist = await redis.exists(filterName); // Sửa "exist" thành "exists"
    if (!exist) {
      await this.createRedisBloomFilter(filterName, falsePositiveRate, capacity);
    }
    return await redis.call("BF.ADD", filterName, value);
  }

  static async checkElementExistInRedisBloomFilter(filterName, value) {
    const redis = await getRedis();
    return await redis.call("BF.EXISTS", filterName, value);
  }

  static async addMultiElementToRedisBloomFilter(filterName, Elements = []) {
    const redis = await getRedis();
    return redis.call("BF.MADD", filterName, ...Elements); // Sửa cú pháp cho ioredis
  }

  static async checkMultiElementExistInRedisBloomFilter(filterName, Elements = []) {
    const redis = await getRedis();
    return redis.call("BF.MEXISTS", filterName, ...Elements); // Sửa cú pháp cho ioredis
  }

  static async setStringEx(key, value, expireTime = 60 * 60 * 24) {
    const redis = await getRedis();
    return redis.set(key, value, "EX", expireTime);
  }

  static async subscribe(channel) {
    const redis = await getRedis();
    console.log(redis)
    try {
      await redis.subscribe(channel);
      console.log(`Subscribed to channel: ${channel}`);
    } catch (error) {
      console.error(`Error subscribing to channel ${channel}:`, error);
      throw error;
    }
  }

  static async onMessage(handler) {
    const redis = await getRedis();
    redis.on("message", (channel, message) => {
      handler(channel, message);
    });
  }
}

module.exports = RedisService;