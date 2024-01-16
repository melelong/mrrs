import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { getWhiteList } from 'src/utils';

@Injectable()
export class CorsGuard implements CanActivate {
  constructor(private configService: ConfigService) { }
  // 日志
  logger = new Logger(CorsGuard.name);
  canActivate(context: ExecutionContext): boolean {
    // 从上下文中取出请求对象
    const request = context.switchToHttp().getRequest<Request>();
    // 取出请求头里的user-agent
    const userAgent = request.headers['user-agent'];
    // 取出请求头里的Origin
    const origin = request.headers.origin;
    // 取出请求对象里的ip、请求方法、路径
    const { ip, method, path } = request;
    const cors_server = this.configService.get('cors_server');
    // 获取origin白名单
    const origin_whiteList = getWhiteList(cors_server.origin_whiteList);
    // 获取methods白名单
    const methods_whiteList = getWhiteList(cors_server.methods_whiteList);
    // 不在origin白名单内
    if (!origin_whiteList.includes(origin))
      this.loggerWarn({
        method,
        path,
        ip,
        userAgent,
        context,
        origin,
        name: 'origin',
      });
    // 不在methods白名单内
    if (!methods_whiteList.includes(method))
      this.loggerWarn({
        method,
        path,
        ip,
        userAgent,
        context,
        origin,
        name: 'method',
      });
    return true;
  }
  // 输出警告
  loggerWarn({ method, path, ip, userAgent, context, origin, name }) {
    this.logger.warn(
      `${method} ${path} ${ip} ${userAgent}: ${context.getClass().name} ${context.getHandler().name
      } invoked...`,
    );
    this.logger.warn(`${name}:${origin} not whitelisted`);
    throw new ForbiddenException('CORS not allowed');
  }
}
