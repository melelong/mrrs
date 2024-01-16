import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
// 前端调用登录接口的格式
export class LoginUserDto {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  @ApiProperty()
  username: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  @MinLength(6, {
    message: '密码不能少于 6 位',
  })
  @ApiProperty({
    minLength: 6,
  })
  password: string;

  @IsNotEmpty({
    message: '验证码不能为空',
  })
  @MinLength(4, {
    message: '验证码不能少于4位',
  })
  @MaxLength(4, {
    message: '验证码不能多于4位',
  })
  @ApiProperty({
    minLength: 4,
    maxLength: 4,
  })
  captcha: string;
}
