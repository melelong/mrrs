import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
/**
 * 前端传来的数据格式的全局异常处理
 */
@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    response.statusCode = exception.getStatus();

    const res = exception.getResponse() as { message: string[] };

    response
      .json({
        code: exception.getStatus(),
        message: 'fail',
        data: res?.message?.join ? res?.message?.join(',') : exception.message,
      })
      .end();
  }
}
