import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes';
import { ConfigService } from '@nestjs/config';
import { FormatResponseInterceptor } from './interceptors/format-response.interceptor';
import { InvokeRecordInterceptor } from './interceptors/invoke-record.interceptor';
import { UnloginFilter } from './user/filters/unlogin.filter';
import { CustomExceptionFilter } from './user/filters/custom-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // 根据根模块创建服务
  const app = await NestFactory.create(AppModule);
  // 开启全局通道
  app.useGlobalPipes(new ValidationPipe());
  // 开启全局响应的格式化
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  // 开启全局响应的记录日志
  app.useGlobalInterceptors(new InvokeRecordInterceptor());
  // 开启全局异常处理
  // 没登录的异常处理
  app.useGlobalFilters(new UnloginFilter());
  // 前端传来的数据格式的异常处理
  app.useGlobalFilters(new CustomExceptionFilter());
  const configService = app.get(ConfigService);
  // 设置接口都以api开头
  app.setGlobalPrefix(configService.get('nest_server_path'));
  // swagger接口文档(和服务端口监听放在最后面)
  const config = new DocumentBuilder()
    // 接口文档标题
    .setTitle(configService.get('swagger_server_title'))
    // 接口文档描述
    .setDescription(configService.get('swagger_server_description'))
    // 接口文档版本
    .setVersion(configService.get('swagger_server_version'))
    // 接口认证类型
    .addBearerAuth({
      type: configService.get('swagger_server_auth_type'),
      description: configService.get('swagger_server_auth_description'),
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // 接口文档访问路径
  SwaggerModule.setup(configService.get('swagger_server_path'), app, document);
  // 服务端口监听
  await app.listen(configService.get('nest_server_port'));
}
bootstrap();
