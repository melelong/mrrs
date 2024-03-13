import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common/pipes';
import { FormatResponseInterceptor } from './interceptors/format-response.interceptor';
import { InvokeRecordInterceptor } from './interceptors/invoke-record.interceptor';
import { UnloginFilter } from './filters/unlogin.filter';
import { CustomExceptionFilter } from './filters/custom-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getWhiteList } from './utils';
import helmet from 'helmet';
import { CustomThrottlerExceptionFilter } from './filters/custom-throttler-exception.filter';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // 根据根模块创建服务
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  /**
   * 获取所有配置
   */
  // 注入配置服务
  const configService = app.get(ConfigService);
  // 获取cors 相关配置
  const {
    origin_whiteList,
    methods_whiteList,
    exposedHeaders_whiteList,
    allowedHeaders_whiteList,
    credentials,
    optionsSuccessStatus,
    maxAge,
  } = configService.get('cors_server');
  // 获取cors白名单
  const origin = getWhiteList(origin_whiteList);
  const methods = getWhiteList(methods_whiteList);
  const exposedHeaders = getWhiteList(exposedHeaders_whiteList);
  const allowedHeaders = getWhiteList(allowedHeaders_whiteList);
  // 获取 helmet 相关配置
  const { xDnsPrefetchControl, xFrameOptions, strictTransportSecurity } =
    configService.get('helmet_server');
  // 获取nest 服务配置
  const { path, port: nest_port } = configService.get('nest_server');
  // 获取swagger接口文档 相关配置
  const {
    title,
    description,
    version,
    auth_type,
    auth_description,
    path: swagger_server_path,
  } = configService.get('swagger_server');
  // 获取静态文件访问服务 相关配置
  const { prefix, name: static_assets_name } = configService.get(
    'static_assets_server',
  );

  /**
   * 开启服务
   */
  // 开启静态文件访问服务
  app.useStaticAssets(join(__dirname, static_assets_name), {
    prefix,
  });
  // 开启cors
  const CorsConfig = {
    origin,
    methods,
    exposedHeaders,
    allowedHeaders,
    credentials,
    optionsSuccessStatus,
    maxAge,
  };
  console.log(CorsConfig);
  app.enableCors(CorsConfig);
  // 开启helmet
  app.use(
    helmet({
      // 是否启用 DNS 预取
      xDnsPrefetchControl: { allow: xDnsPrefetchControl },
      // 减轻点击劫持攻击
      xFrameOptions: { action: xFrameOptions },
      strictTransportSecurity: {
        maxAge: strictTransportSecurity.maxAge,
        preload: strictTransportSecurity.preload,
      },
    }),
  );
  // 开启cookie解析
  app.use(cookieParser());
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
  // 过滤出限流响应，自定义限流响应
  app.useGlobalFilters(new CustomThrottlerExceptionFilter());
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
  await app.listen(nest_port, '0.0.0.0');
}
bootstrap();
