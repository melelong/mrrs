/*
 * 2024-01-02 17:50:40
 * @Github: https://github.com/melelong
 * custom_string_obkoro1~custom_string_obkoro100都可以输出自定义信息
 * @Author: melelong
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 * @LastEditors: 可以输入预定的版权声明、个性签名、空行等
 */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { RedisModule } from './redis/redis.module';
import { MysqlModule } from './mysql/mysql.module';
import { EmailModule } from './email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './guards/login.guard';
import { PermissionGuard } from './guards/permission.guard';
import { CorsGuard } from './guards/cors.guard';
import { getConfig } from './utils';
import { CheckModule } from './check/check.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
interface RedisOptions {
  host: string;
  port: number;
  password: string;
  database: number;
}
@Module({
  imports: [
    // 导入配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      load: [getConfig],
    }),
    // 导入jwt模块
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        const { secret, signOptions_expiresIn } =
          configService.get('jwt_server');
        return {
          secret,
          signOptions: {
            expiresIn: signOptions_expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
    // 导入节流模块
    ThrottlerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const { short, medium, long } = configService.get('throttler_server');
        const { host, port, password, database }: RedisOptions =
          configService.get('redis_server');
        return {
          throttlers: [
            {
              name: short.name,
              ttl: short.ttl,
              limit: short.limit,
            },
            {
              name: medium.name,
              ttl: medium.ttl,
              limit: medium.limit,
            },
            {
              name: long.name,
              ttl: long.ttl,
              limit: long.limit,
            },
          ],
          storage: new ThrottlerStorageRedisService({
            host,
            port,
            password,
            db: database,
          }),
        };
      },
      inject: [ConfigService],
    }),
    // 导入用户模块
    UserModule,
    // 导入检测模块
    CheckModule,
    // 导入reids模块
    RedisModule,
    // 导入mysql模块
    MysqlModule,
    // 导入邮件模块
    EmailModule,
  ],
  // 导入根模块接口路由
  controllers: [AppController],
  // 先是登录守卫处理请求，后是权限守卫处理请求
  providers: [
    // 导入根模块服务
    AppService,
    {
      // cors守卫
      provide: APP_GUARD,
      useClass: CorsGuard,
    },
    {
      // 登录守卫
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      // 权限守卫
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    {
      // 节流守卫
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
