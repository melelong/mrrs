import {
  BadRequestException,
  ExecutionContext,
  SetMetadata,
  UseInterceptors,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { extname } from 'path';
// 自定义装饰器
/**
 * 是否登录
 * @returns
 */
export const RequireLogin = () => SetMetadata('require-login', true);
/**
 * 是否有接口权限
 * @param permissions 权限数组
 * @returns
 */
export const RequirePermission = (...permissions: string[]) =>
  SetMetadata('require-permission', permissions);
/**
 * 获取用户信息(需要配合RequireLogin)
 */
export const UserInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    // 上下文获取请求
    const request: any = ctx.switchToHttp().getRequest<Request>();
    if (!request.user) {
      return null;
    }
    return data ? request.user[data] : request.user;
  },
);

/**
 * 公共上传
 * @param fileName 存放文件的目录名(默认为file)，和前端传的参数对应，会生成相对应的目录名
 * @param options 配置
 * @returns
 */
export const Upload = (fileName: string = 'file', options?: MulterOptions) => {
  return applyDecorators(UseInterceptors(FileInterceptor(fileName, options)));
};

/**
 * 获取文件类型过滤函数
 * @param fileType 文件类型数组
 * @param msg 错误消息
 * @returns
 */
export const getFileTypeFilter = (
  fileType: string[],
  msg: string = '文件类型错误',
) => {
  fileType = fileType.map((item) => item.toLowerCase());
  return (_req: any, file: any, callback: any) => {
    const fileExtname = extname(file.originalname).toLowerCase();
    if (fileType.includes(fileExtname)) {
      callback(null, true);
    } else {
      callback(new BadRequestException(msg), false);
    }
  };
};
