import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common/pipes';
import { FormatResponseInterceptor } from './interceptors/format-response.interceptor';
import { InvokeRecordInterceptor } from './interceptors/invoke-record.interceptor';
import { UnloginFilter } from './user/filters/unlogin.filter';
import { CustomExceptionFilter } from './user/filters/custom-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getWhiteList } from './utils';

async function bootstrap() {
  // 根据根模块创建服务
  const app = await NestFactory.create(AppModule);

  /**
   * 获取所有配置
   */
  // 注入配置服务
  const configService = app.get(ConfigService);
  // 获取cors 相关配置
  const { origin_whiteList, methods_whiteList } =
    configService.get('cors_server');
  // 获取origin白名单和methods白名单
  const origin = getWhiteList(origin_whiteList);
  const methods = getWhiteList(methods_whiteList);
  // 获取nest 服务配置
  const { path, port } = configService.get('nest_server');
  // 获取swagger接口文档 相关配置
  const {
    title,
    description,
    version,
    auth_type,
    auth_description,
    path: swagger_server_path,
  } = configService.get('swagger_server');

  /**
   * 开启服务
   */
  // 开启cors
  app.enableCors({
    origin,
    methods,
  });
  // 开启全局通道
  app.useGlobalPipes(new ValidationPipe());
  // 开启全局响应的格式化
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  // 开启全局响应的记录日志
  app.useGlobalInterceptors(new InvokeRecordInterceptor());
  // 没登录的全局异常处理
  app.useGlobalFilters(new UnloginFilter());
  // 前端传来的数据格式的全局异常处理
  app.useGlobalFilters(new CustomExceptionFilter());
  // 设置接口都以api开头
  app.setGlobalPrefix(path);
  // swagger接口文档(和服务端口监听放在最后面)
  const config = new DocumentBuilder()
    // 接口文档标题
    .setTitle(title)
    // 接口文档描述
    .setDescription(description)
    // 接口文档版本
    .setVersion(version)
    // 接口认证类型
    .addBearerAuth({
      type: auth_type,
      description: auth_description,
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // 接口文档访问路径
  SwaggerModule.setup(swagger_server_path, app, document);
  // 服务端口监听
  await app.listen(port);
}
bootstrap();
