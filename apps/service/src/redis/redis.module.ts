import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    RedisService,
    // redis服务配置
    {
      provide: 'REDIS_CLIENT',
      async useFactory(configService: ConfigService) {
        const client = createClient(
          RedisService.getRedisOptions(configService.get('redis_server')),
        );
        await client.connect();
        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisService],
})
export class RedisModule { }
