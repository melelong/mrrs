import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  RequireLogin,
  RequirePermission,
  UserInfo,
} from './decorators/custom.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }
  @Get('aaa')
  @RequireLogin()
  @RequirePermission('ddd')
  aaaa(@UserInfo('username') username: string, @UserInfo() userInfo) {
    console.log(username);
    console.log(userInfo);
    return 'aaa';
  }

  @Get('bbb')
  bbb() {
    return 'bbb';
  }

  @Get()
  getHello(): string {
    return this.appService.start();
  }
}
