import {
  ExecutionContext,
  SetMetadata,
  createParamDecorator,
} from '@nestjs/common';
// 自定义装饰器

// 是否登录
export const RequireLogin = () => SetMetadata('require-login', true);
// 是否有接口权限
export const RequirePermission = (...permissions: string[]) =>
  SetMetadata('require-permission', permissions);
// 获取用户信息
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
