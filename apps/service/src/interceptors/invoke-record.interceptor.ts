/*
 * 2024-01-08 00:24:24
 * @Github: https://github.com/melelong
 * custom_string_obkoro1~custom_string_obkoro100都可以输出自定义信息
 * @Author: melelong
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 * @LastEditors: 可以输入预定的版权声明、个性签名、空行等
 */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';
import { isRes } from 'src/utils';
/**
 * 全局响应的记录日志
 */
@Injectable()
export class InvokeRecordInterceptor implements NestInterceptor {
  private readonly logger = new Logger(InvokeRecordInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // 从上下文中取出请求对象
    const request = context.switchToHttp().getRequest<Request>();
    // 从上下文中取出响应对象
    const response = context.switchToHttp().getResponse<Response>();
    // 取出请求头里的user-agent
    const userAgent = request.headers['user-agent'];
    // 取出请求对象里的ip、请求方法、路径
    const { ip, method, path, url } = request;
    // 日志打印出信息
    this.logger.debug(
      `${method} ${path} ${ip} ${userAgent}: ${context.getClass().name} ${context.getHandler().name
      } invoked...`,
    );
    // 日志打印出用户信息
    this.logger.debug(
      `user: ${request.user?.userId}, ${request.user?.username}`,
    );

    const now = Date.now();

    return next.handle().pipe(
      tap((res) => {
        // 是获取资源接口就不打印
        if (isRes(url)) return;
        // 打印响应时间
        this.logger.debug(
          `${method} ${path} ${ip} ${userAgent}: ${response.statusCode}: ${Date.now() - now
          }ms`,
        );
        this.logger.debug(`响应体: ${JSON.stringify(res)}`);
      }),
    );
  }
}
