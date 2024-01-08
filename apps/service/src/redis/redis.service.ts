import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  // 注入redis的操作对象
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  // 读取服务
  async get(key: string) {
    return await this.redisClient.get(key);
  }

  // 写入服务
  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value);
    // 过期时间
    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }

  async delete(key: string) {
    await this.redisClient.del(key);
  }
}
