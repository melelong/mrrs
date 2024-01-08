import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RedisModule } from './redis/redis.module';
import { MysqlModule } from './mysql/mysql.module';
import { EmailModule } from './email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './guards/login.guard';
import { PermissionGuard } from './guards/permission.guard';

@Module({
  imports: [
    // 导入jwt模块
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('jwt_server_secret'),
          signOptions: {
            expiresIn: configService.get('jwt_server_signOptions_expiresIn'),
          },
        };
      },
      inject: [ConfigService],
    }),
    // 导入用户模块
    UserModule,
    // 导入配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/.env',
    }),
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
      // 登录守卫
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      // 权限守卫
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule { }
