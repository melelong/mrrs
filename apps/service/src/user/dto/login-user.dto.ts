import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
/**
 * 登录接口请求参数格式
 */
export class LoginUserDto {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  @ApiProperty()
  username: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  @MinLength(8, {
    message: '密码不能少于 8 位',
  })
  @ApiProperty({
    minLength: 8,
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
