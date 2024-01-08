import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class PermissionGuard implements CanActivate {
  // 注入反射器对象
  @Inject(Reflector)
  private reflector: Reflector;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 取出上下文对象的请求
    const request: Request = context.switchToHttp().getRequest();

    if (!request.user) {
      return true;
    }
    // 获取登录守卫放到请求中的用户信息
    const permissions = request.user.permissions;
    // 从反射器对象中取出元数据require-permission的信息
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      'require-permission',
      [
        context.getClass(), // 获取类的元数据
        context.getHandler(), // 获取方法的元数据
      ],
    );
    // 该路由没有标记元数据require-permission
    if (!requiredPermissions) {
      return true;
    }
    // 遍历元数据中的权限代码
    for (let i = 0; i < requiredPermissions.length; i++) {
      const curPermission = requiredPermissions[i];
      // 和请求中的用户权限集合比较
      const found = permissions.find((item) => item.code === curPermission);
      if (!found) {
        throw new UnauthorizedException('您没有访问该接口的权限');
      }
    }

    return true;
  }
}
