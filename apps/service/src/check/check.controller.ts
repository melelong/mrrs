/*
 * 2024-01-17 23:26:07
 * @Github: https://github.com/melelong
 * custom_string_obkoro1~custom_string_obkoro100都可以输出自定义信息
 * @Author: melelong
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 * @LastEditors: 可以输入预定的版权声明、个性签名、空行等
 */
import { Controller, Get, Query, Res } from '@nestjs/common';
import { CheckService } from './check.service';
import { Response } from 'express';
// import { CheckEnvDto } from './dto/check-env.dto';

@Controller('check')
export class CheckController {
  constructor(private readonly checkService: CheckService) { }

  @Get('env')
  async checkEnv(@Query() env: any, @Res({ passthrough: true }) res: Response) {
    return await this.checkService.checkEnv(env, res);
  }
}
