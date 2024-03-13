import { Global, Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import multer from 'multer';
import { extname, join } from 'path';
import { UploadController } from './upload.controller';
import { mkdirSync } from 'fs';
@Global()
@Module({
  imports: [
    // 上传图片文件
    MulterModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const { name } = configService.get('static_assets_server');
        const destination = join(__dirname, `../${name}`);
        return {
          storage: multer.diskStorage({
            destination,
            filename: (_req, file, callback) => {
              const filePath = join(__dirname, `../${name}/${file.fieldname}`);
              try {
                mkdirSync(filePath);
              } catch (error) { }
              const time = new Date().getTime();
              const fileExtname = extname(file.originalname);
              const fileName = `${time + fileExtname}`;
              return callback(null, `${file.fieldname}/${fileName}`);
            },
          }),
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [UploadService],
  exports: [UploadService],
  controllers: [UploadController],
})
export class UploadModule { }
