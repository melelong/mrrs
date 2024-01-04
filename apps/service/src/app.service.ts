/*
 * 2024-01-02 17:50:40
 * @Github: https://github.com/melelong
 * custom_string_obkoro1~custom_string_obkoro100都可以输出自定义信息
 * @Author: melelong
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 * @LastEditors: 可以输入预定的版权声明、个性签名、空行等
 */
import { Injectable } from '@nestjs/common';
// import { md5 } from './utils';

@Injectable()
export class AppService {
  getHello(): string {
    // return md5('12');
    return '<h1>会议室预订系统接口服务</h1>';
  }
}
