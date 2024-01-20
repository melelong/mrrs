import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
interface RedisOptions {
  host: string;
  port: number;
  password: string;
  database: number;
}
@Injectable()
export class RedisService {
  // 注入redis的操作对象
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  static getRedisOptions(options: RedisOptions) {
    const { host, port, password, database } = options;
    return {
      socket: {
        host,
        port,
      },
      password,
      database,
    };
  }

  /**
   * 写入string，用于存储邮箱验证码、短信验证码
   * @param key 键名
   * @param value 值
   * @param ttl 过期时间
   */
  async set(key: string, value: string | number, ttl?: number): Promise<void> {
    await this.redisClient.set(key, value);
    // 过期时间
    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }

  /**
   * 获取string，用于存储邮箱验证码、短信验证码
   * @param key 键名
   * @returns
   */
  async get(key: string): Promise<string> {
    return await this.redisClient.get(key);
  }

  /**
   * 删除数据
   * @param key 键名
   */
  async del(key: string) {
    await this.redisClient.del(key);
  }
}
