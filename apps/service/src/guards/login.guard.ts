import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Permission } from '../user/entities/permission.entity';
import { UnLoginException } from 'src/user/filters/unlogin.filter';
// 定义jwt用户数据接口类型
interface JwtUserData {
  userId: number;
  username: string;
  roles: string[];
  permissions: Permission[];
}
// 定义express类型声明
declare module 'express' {
  interface Request {
    user: JwtUserData;
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  // 注入反射器对象
  @Inject()
  private reflector: Reflector;

  // 注入jwt服务
  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext, // 执行上下文对象
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 取出上下文对象的请求
    const request: Request = context.switchToHttp().getRequest();
    // 从反射器中获取 require-login 元数据，判断当前路由是否需要登录才能访问
    const requireLogin = this.reflector.getAllAndOverride('require-login', [
      context.getClass(), // 获取类的元数据
      context.getHandler(), // 获取方法的元数据
    ]);
    // 该路由没有标记元数据require-login
    if (!requireLogin) {
      return true;
    }
    // 取出请求头里的authorization
    const authorization = request.headers.authorization;
    // 前端没有传token
    if (!authorization) {
      // throw new UnauthorizedException('用户未登录');
      throw new UnLoginException();
    }

    try {
      // 获取前端传过来的token
      const token = authorization.split(' ')[1];
      // 解析token
      const data = this.jwtService.verify<JwtUserData>(token);
      // 把token中的用户信息放到请求中，方便给权限守卫鉴权
      request.user = {
        userId: data.userId,
        username: data.username,
        roles: data.roles,
        permissions: data.permissions,
      };
      return true;
    } catch (e) {
      throw new UnauthorizedException('token 失效，请重新登录');
    }
  }
}
