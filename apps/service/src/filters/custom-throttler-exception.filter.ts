import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Response } from 'express';

@Catch(ThrottlerException)
export class CustomThrottlerExceptionFilter implements ExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    response.statusCode = exception.getStatus();

    // 自定义限流响应
    response
      .json({
        code: 429,
        message: 'fail',
        data: '请求过于频繁，请稍后再试!!!',
      })
      .end();
  }
}
