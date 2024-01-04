import { IsNotEmpty } from 'class-validator';
// 前端调用登录接口的格式
export class LoginUserDto {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;
}
