// 全局工具方法
import { BadRequestException, ParseIntPipe } from '@nestjs/common';
import { crypto } from '@repo/utils';
export function md5(str: string): string {
  return crypto.md5(str);
}
export function generateParseIntPipe(name) {
  return new ParseIntPipe({
    exceptionFactory() {
      throw new BadRequestException(name + ' 应该传数字');
    },
  });
}
