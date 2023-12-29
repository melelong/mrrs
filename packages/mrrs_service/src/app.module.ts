import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RedisModule } from './redis/redis.module';
import { MysqlModule } from './mysql/mysql.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    UserModule,
    RedisModule,
    MysqlModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
