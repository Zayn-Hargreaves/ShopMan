
const { date } = require("joi");
const { BadGatewayError } = require("../../cores/error.response");
const { getRedis } = require("../../db/rdb");
const { v4: uuidv4 } = require("uuid")
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
    return redis.call("BF.MADD", filterName, ...Elements);
  }

  static async checkMultiElementExistInRedisBloomFilter(filterName, Elements = []) {
    const redis = await getRedis();
    return redis.call("BF.MEXISTS", filterName, ...Elements);
  }

  static async setStringEx(key, value, expireTime = 60 * 60 * 24) {
    const redis = await getRedis();
    return redis.set(key, value, "EX", expireTime);
  }

  static async upsertItemIntoZset(key, member, score, ttl) {
    const redis = await getRedis()
    try {
      await redis.zincrby(key, score, member)

      if (ttl && Number.isInteger(ttl) && ttl > 0) {
        await redis.expire(key, ttl)
      }
      return true
    } catch (error) {
      throw new BadGatewayError(`Error upserting item into ZSET ${key}:`, error)
    }
  }
  static async getZsetByScoreDescWithLimit(key, cursorScore = "+inf", limit = 10) {
    const redis = await getRedis();
    try {
      return await redis.zrevrangebyscore(
        key,
        `(${cursorScore}`,
        "-inf",
        "WITHSCORES",
        "LIMIT",
        0,
        limit
      );
    } catch (error) {
      throw new BadGatewayError(`Error getting ZSET by score (desc) from ${key}: ${error.message}`);
    }
  }

  static async getZsetRange(key, start, end = -1, withScores = true) {
    const redis = await getRedis()
    try {
      return await redis.zrevrange(key, start, end, withScores ? "WITHSCORES" : '"')
    } catch (error) {
      throw new BadGatewayError(`Error getting ZSET range ${key}:${error}`)
    }
  }
  static async getZsetScore(key, member) {
    const redis = await getRedis()
    try {
      return await redis.zscore(key, member)
    } catch (error) {
      throw new BadGatewayError(`Error getting score for ${member} in ZSET ${key}:${error}`)
    }
  }
  static async removeZsetItem(key, member) {
    const redis = await getRedis()
    try {
      return await redis.zrem(key, member)
    } catch (error) {
      throw new BadGatewayError(`Error removing ${member} from ZSET ${key}:${error}`,)
    }
  }
  static async getZsetCount(zsetkey) {
    const redis = await getRedis()
    try {
      return await redis.zcard(zsetkey)
    } catch (error) {
      throw new BadGatewayError(`Error counting elements in ZSET ${zsetkey}:${error}`)
    }
  }
  static async cacheData(key, value, ttl = 3600) {
    const redis = await getRedis()
    try {
      const serializedValue = JSON.stringify(value)
      return await redis.set(key, serializedValue, "EX", ttl)
    } catch (error) {
      throw new BadGatewayError(`Error caching data for key ${key}:${error}`)
    }
  }
  static async getCachedData(key) {
    const redis = await getRedis()
    const data = await redis.get(key)
    return JSON.parse(data)
  }
  static async setTrendingScore(zsetkey, productId, score, ttl = null) {
    const redis = await getRedis()
    try {
      await redis.zadd(zsetkey, score, `product:${productId}`)
      if (ttl && Number.isInteger(ttl) && ttl > 0) {
        const exist = await redis.exists(zsetkey)
        if (!exist) {
          await redis.expire(zsetkey, ttl)
        }
      }
      return true
    } catch (error) {
      console.log(error)
      throw new BadGatewayError(`Error setting trending score for ${productId} in ZSET ${zsetkey}:${error}`)
    }
  }
  static async cacheHashField(hashKey, field, value, ttl = 3600) {
    const redis = await getRedis()
    await redis.hset(hashKey, field, JSON.stringify(value))
    await redis.expire(hashKey, ttl)
  }
  static async getHashField(hashKey, field) {
    const redis = await getRedis();
    const val = await redis.hget(hashKey, field);
    return val ? JSON.parse(val) : null;
  }
  static async removeHashField(hashKey, field) {
    const redis = await getRedis();
    return await redis.hdel(hashKey, field);
  }
  static async acquireLock({ productID, skuNo, cartID, quantity, timeout = 10 }) {
    const redis = await getRedis();
    const lockKey = `lock:product:${productID}:sku:${skuNo}:cart:${cartID}`;
    const token = uuidv4();

    try {
      const result = await redis.set(lockKey, token, "NX", "EX", timeout);
      if (result === "OK") {
        // ✅ Ghi nhận quantity đang giữ chỗ vào HASH để dễ thống kê
        const hashKey = `reserved:product:${productID}:sku:${skuNo}`;
        await redis.hincrby(hashKey, cartID, quantity);
        await redis.expire(hashKey, timeout); // đảm bảo TTL

        return { key: lockKey, token, productID, skuNo, cartID };
      } else {
        return null;
      }
    } catch (err) {
      throw new BadGatewayError(`Error acquiring lock for product ${productID}: ${err.message}`);
    }
  }


  static async releaseLock({ key, token, productID, skuNo, cartID }) {
    const redis = await getRedis();

    try {
      const currentToken = await redis.get(key);
      if (currentToken !== token) return false;

      // ✅ Xoá lock
      await redis.del(key);

      // ✅ Xoá lượng reserved từ HASH
      const hashKey = `reserved:product:${productID}:sku:${skuNo}`;
      await redis.hdel(hashKey, cartID);

      return true;
    } catch (error) {
      throw new BadGatewayError(`Error releasing lock for key ${key}: ${error.message}`);
    }
  }
  static async getReservedQuantity(productID, skuNo) {
    const redis = await getRedis();
    try {
      const hashKey = `reserved:product:${productID}:sku:${skuNo}`;
      const values = await redis.hvals(hashKey);
      return values.reduce((sum, val) => sum + parseInt(val, 10), 0);
    } catch (err) {
      throw new BadGatewayError(`Error reading reserved quantity for product ${productID} | ${skuNo}: ${err.message}`);
    }
  }
  static async set(key, value, ttl = 3600) {
    const redis = await getRedis();
    try {
      const serializedValue = JSON.stringify(value);
      await redis.set(key, serializedValue, "EX", ttl);
    } catch (error) {
      throw new BadGatewayError(`Error setting key ${key} in Redis: ${error.message}`);
    }
  }
  static async get(key) {
    const redis = await getRedis();
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  }
  static async remove(key) {
    const redis = await getRedis();
    try {
      return await redis.del(key);
    } catch (err) {
      throw new BadGatewayError(`Error deleting Redis key ${key}: ${err.message}`);
    }
  }
  static async getAllHashField(hashKey) {
    const redis = await getRedis();
    const rawData = await redis.hgetall(hashKey);

    if (!rawData || Object.keys(rawData).length === 0) {
      console.log(`[Redis] MISS for key ${hashKey}`);
      return [];
    }

    console.log(`[Redis] HIT for key ${hashKey}: ${Object.keys(rawData).length} items`);
    return Object.entries(rawData).map(([field, val]) => ({
      field,
      ...JSON.parse(val)
    }));
  }

  static async deleteHashKey(hashKey) {
    const redis = await getRedis();
    return await redis.del(hashKey);
  }

  static async updateHashField(hashKey, fieldKey, updaterFn, ttl = 3600) {
    const redis = await getRedis();
    const currentValue = await redis.hget(hashKey, fieldKey);
    let value = currentValue ? JSON.parse(currentValue) : null;

    const updatedValue = updaterFn(value);
    if (updatedValue === null) {
      await redis.hdel(hashKey, fieldKey);
    } else {
      await redis.hset(hashKey, fieldKey, JSON.stringify(updatedValue));
      await redis.expire(hashKey, ttl);
    }
  }
  static async addToSet(key, member) {
    const redis = await getRedis();
    return await redis.sadd(key, member);
  }
  static async addManyToSet(key, members = []) {
    if (!Array.isArray(members) || members.length === 0) return 0;
    const redis = await getRedis();
    return await redis.sadd(key, ...members);
  }
  static async isMemberOfSet(key, member) {
    const redis = await getRedis();
    return await redis.sismember(key, member);
  }
  static async getAllMembersFromSet(key) {
    const redis = await getRedis();
    return await redis.smembers(key);
  }
  static async getRandomMembersFromSet(key, count = 10) {
    const redis = await getRedis();
    return await redis.srandmember(key, count);
  }
  static async removeFromSet(key, member) {
    const redis = await getRedis();
    return await redis.srem(key, member);
  }
  static async getSetCardinality(key) {
    const redis = await getRedis();
    return await redis.scard(key);
  }
  static async scanSet(key, cursor = 0, count = 100) {
    const redis = await getRedis();
    return await redis.sscan(key, cursor, "COUNT", count);
  }
  static async getSetIntersection(...keys) {
    const redis = await getRedis();
    return await redis.sinter(...keys);
  }
  static async getSetUnion(...keys) {
    const redis = await getRedis();
    return await redis.sunion(...keys);
  }
  static async getSetDifference(keyA, ...otherKeys) {
    const redis = await getRedis();
    return await redis.sdiff(keyA, ...otherKeys);
  }
// RedisService.getSetIntersection('shop:followers:shopId', 'product:wishlist:456');
}

module.exports = RedisService;