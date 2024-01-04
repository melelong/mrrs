import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RedisModule } from './redis/redis.module';
import { MysqlModule } from './mysql/mysql.module';
import { EmailModule } from './email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    // 开启jwt服务
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
    // 开启用户模块
    UserModule,
    // 开启配置服务
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/.env',
    }),
    // 开启reids服务
    RedisModule,
    // 开启mysql服务
    MysqlModule,
    // 开启邮件服务
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
