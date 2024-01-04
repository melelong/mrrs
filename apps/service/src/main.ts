import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 开启全局通道
  app.useGlobalPipes(new ValidationPipe());
  // 设置接口都以api开头
  app.setGlobalPrefix('api');
  const configService = app.get(ConfigService);
  // 服务端口监听
  await app.listen(configService.get('nest_server_port'));
}
bootstrap();
