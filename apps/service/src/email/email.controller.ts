import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Ip,
  Query,
  Headers,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { RedisService } from 'src/redis/redis.service';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequireLogin } from 'src/decorators/custom.decorator';
import { CaptchaDto } from './dto/captcha.dto';
@ApiTags('邮件验证码模块')
@Controller('user')
export class EmailController {
  // 注入邮件模块的服务
  constructor(private readonly emailService: EmailService) { }

  // 注入reids服务
  @Inject(RedisService)
  private redisService: RedisService;

  /**
   * 注册功能邮件验证码接口路由
   * @param query 邮箱验证码接口请求参数格式
   * @returns
   */
  @ApiQuery({
    name: 'address',
    type: String,
    description: '邮箱地址',
    required: true,
    example: 'xxx@xx.com',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '发送成功',
    type: String,
  })
  @Get('register-captcha')
  async registerCaptcha(@Query() query: CaptchaDto) {
    const { address } = query;
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(`captcha_${address}`, code, 5 * 60);

    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`,
    });
    return '发送成功';
  }

  /**
   * 修改密码功能邮件验证码接口路由
   * @param query 邮箱验证码接口请求参数格式
   * @returns
   */
  @ApiQuery({
    name: 'address',
    description: '邮箱地址',
    type: String,
  })
  @ApiResponse({
    type: String,
    description: '发送成功',
  })
  @Get('update_password/captcha')
  async updatePasswordCaptcha(@Query() query: CaptchaDto) {
    const { address } = query;
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(
      `update_password_captcha_${address}`,
      code,
      10 * 60,
    );

    await this.emailService.sendMail({
      to: address,
      subject: '更改密码验证码',
      html: `<p>你的更改密码验证码是 ${code}</p>`,
    });
    return '发送成功';
  }

  /**
   * 修改用户信息功能邮件验证码接口路由
   * @param query 邮箱验证码接口请求参数格式
   * @returns
   */
  @ApiBearerAuth()
  @ApiQuery({
    name: 'address',
    description: '邮箱地址',
    type: String,
  })
  @ApiResponse({
    type: String,
    description: '发送成功',
  })
  @Get('update/captcha')
  @RequireLogin()
  async updateUserCaptcha(@Query() query: CaptchaDto) {
    const { address } = query;
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(
      `update_user_captcha_${address}`,
      code,
      10 * 60,
    );

    await this.emailService.sendMail({
      to: address,
      subject: '更改用户信息验证码',
      html: `<p>你的更改用户信息验证码是 ${code}</p>`,
    });
    return '发送成功';
  }

  /**
   * 普通用户svg验证码接口路由
   * @param ip 客户端ip
   * @param origin 客户端origin
   * @param ua 客户端ua
   * @returns
   */
  @Get('res/userCaptcha')
  async userCaptcha(
    @Ip() ip: string,
    @Headers('Origin') origin: string,
    @Headers('User-Agent') ua: string,
  ) {
    return await this.emailService.captcha(
      {
        ip,
        origin,
        ua,
      },
      false,
    );
  }

  /**
   * 管理员svg验证码接口路由
   * @param ip 客户端ip
   * @param origin 客户端origin
   * @param ua 客户端ua
   * @returns
   */
  @Get('res/adminCaptcha')
  async adminCaptcha(
    @Ip() ip: string,
    @Headers('Origin') origin: string,
    @Headers('User-Agent') ua: string,
  ) {
    return await this.emailService.captcha(
      {
        ip,
        origin,
        ua,
      },
      true,
    );
  }
}
