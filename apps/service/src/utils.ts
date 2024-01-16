// 全局工具方法
import { BadRequestException, ParseIntPipe } from '@nestjs/common';
import { crypto } from '@repo/utils';
import path from 'node:path';
import fs from 'node:fs';
import { parse } from 'yaml';
// 异步运算
export async function md5(
  str: string,
  salt: CryptoJS.lib.WordArray,
): Promise<string> {
  return crypto.md5(str, salt);
}
export async function sha256(
  str: string,
  salt: CryptoJS.lib.WordArray,
): Promise<string> {
  return crypto.sha256(str, salt);
}
export function getSalt(str: string): CryptoJS.lib.WordArray {
  return crypto.wordArray(str);
}
export function generateParseIntPipe(name: string) {
  return new ParseIntPipe({
    exceptionFactory() {
      throw new BadRequestException(name + ' 应该传数字');
    },
  });
}
// env白名单配置字符串转成数组
export function getWhiteList(whiteList: string) {
  return whiteList.split(',');
}
// 判断是否为资源请求
export function isRes(url: string): boolean {
  return /\/res\//.test(url);
}

// 获取项目运行环境
export const getEnv = () => {
  return process.env.RUNNING_ENV;
};

// 读取项目配置
export const getConfig = () => {
  const environment = getEnv();
  const yamlPath = path.join(
    process.cwd(),
    `./src/.config/.${environment}.yaml`,
  );
  const file = fs.readFileSync(yamlPath, 'utf8');
  const config = parse(file);
  return config;
};
