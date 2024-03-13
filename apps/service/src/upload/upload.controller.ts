import { Controller, Post, UploadedFile } from '@nestjs/common';
import { UploadService } from './upload.service';
import { Upload, getFileTypeFilter } from 'src/decorators/custom.decorator';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  /**
   * 上传头像接口路由
   * @param file 文件
   * @returns
   */
  @Post('headPic')
  @Upload('headPic', {
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
    fileFilter: getFileTypeFilter(
      ['.png', '.jpg', '.jpeg', '.gif'],
      '只能上传图片文件',
    ),
  })
  async uploadHeadPic(@UploadedFile() headPic: Express.Multer.File) {
    const res = await this.uploadService.uploadHeadPic(headPic);
    return res;
  }
}
