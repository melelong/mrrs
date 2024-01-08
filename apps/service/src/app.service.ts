import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  start(): string {
    return '<h1>会议室预订系统接口服务</h1>';
  }
}
