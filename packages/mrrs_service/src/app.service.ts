import { Injectable } from '@nestjs/common';
import { md5 } from './utils';

@Injectable()
export class AppService {
  getHello(): string {
    return md5('12');
    return '<h1>会议室预订系统接口服务</h1>';
  }
}
