import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  transporter: Transporter;
  // 注入配置服务
  constructor(private configService: ConfigService) {
    // 创建邮件对象
    this.transporter = createTransport({
      host: this.configService.get('nodemailer_host'),
      port: this.configService.get('nodemailer_port'),
      secure: false,
      auth: {
        user: this.configService.get('nodemailer_auth_user'),
        pass: this.configService.get('nodemailer_auth_pass'),
      },
    });
  }
  // 发邮件
  async sendMail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: {
        name: this.configService.get('nest_server_name'),
        address: this.configService.get('nodemailer_auth_user'),
      },
      to,
      subject,
      html,
    });
  }
}
