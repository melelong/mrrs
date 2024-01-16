/*
 * 2024-01-02 17:50:40
 * @Github: https://github.com/melelong
 * custom_string_obkoro1~custom_string_obkoro100都可以输出自定义信息
 * @Author: melelong
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 * @LastEditors: 可以输入预定的版权声明、个性签名、空行等
 */
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getSalt, md5 } from 'src/utils';
import { createTransport, Transporter } from 'nodemailer';
import { RedisService } from 'src/redis/redis.service';
import { create, ConfigObject } from 'svg-captcha';
interface HashOptions {
  ip: string;
  origin: string;
  ua: string;
}
@Injectable()
export class EmailService {
  private transporter: Transporter;
  // 盐
  private salt: CryptoJS.lib.WordArray;
  // 注入配置服务
  constructor(private configService: ConfigService) {
    const { host, port, auth_user, auth_pass } =
      configService.get('nodemailer_server');
    // 创建邮件对象
    this.transporter = createTransport({
      host,
      port,
      secure: false,
      auth: {
        user: auth_user,
        pass: auth_pass,
      },
    });
  }

  // 注入reids服务
  @Inject(RedisService)
  private redisService: RedisService;

  async setSalt() {
    this.salt = getSalt(await this.configService.get('nest_server').salt);
  }
  // 发邮件
  async sendMail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: {
        name: this.configService.get('nest_server').name,
        address: this.configService.get('nodemailer_server').auth_user,
      },
      to,
      subject,
      html,
    });
  }

  // 生成图片验证码
  async captcha(
    hashOptions: HashOptions,
    isAdmin: boolean,
    config?: ConfigObject,
  ) {
    await this.setSalt();
    // 生成hash要素
    const { ip, origin, ua } = hashOptions;
    // 随机背景颜色
    const color = Math.random().toString(16).substring(4, 10);
    // 类型名字
    const typeName = `${isAdmin ? 'admin' : 'user'}`;
    const { data, text } = create({
      noise: 4,
      background: `#${color}`,
      // width: 200,
      // height: 100,
      ...config,
    });
    // 使用异步运算加快接口响应速度
    md5(`${ip}_${origin}_${ua}_${typeName}`, this.salt).then((hash) => {
      this.redisService.set(
        `${typeName}_login_${hash.substring(0, 8)}`,
        text,
        5 * 60,
      );
    });
    return data;
  }
}
