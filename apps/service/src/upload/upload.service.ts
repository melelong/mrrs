import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  // 注入配置服务
  @Inject(ConfigService)
  private configService: ConfigService;

  getAccessInfo() {
    const { protocol, domain, port } = this.configService.get('nest_server');
    const { prefix } = this.configService.get('static_assets_server');
    const accessPath = `${protocol}://${domain}:${port + prefix}`;
    return {
      protocol,
      domain,
      port,
      prefix,
      accessPath,
    };
  }

  async uploadHeadPic(headPic: Express.Multer.File) {
    if (!headPic) {
      throw new BadRequestException('头像图片没有上传');
    }
    const { prefix } = this.getAccessInfo();
    return {
      ...headPic,
      accessPath: `${prefix}/${headPic.filename}`,
    };
  }
}
