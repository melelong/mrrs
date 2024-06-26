/*
 * 2024-01-02 17:50:40
 * @Github: https://github.com/melelong
 * custom_string_obkoro1~custom_string_obkoro100都可以输出自定义信息
 * @Author: melelong
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 * @LastEditors: 可以输入预定的版权声明、个性签名、空行等
 */
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
/**
 * 获取盐
 * @param str 盐
 * @returns
 */
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

/**
 * env白名单配置字符串转成数组
 * @param whiteList 白名单
 * @returns
 */
export function getWhiteList(whiteList: string) {
  return whiteList.split(',');
}

/**
 * 判断是否为资源请求
 * @param url url地址
 * @returns
 */
export function isRes(url: string): boolean {
  return /\/res\//.test(url);
}

/**
 * 获取项目运行环境
 * @returns
 */
export const getEnv = () => {
  return process.env.RUNNING_ENV;
};

/**
 * 读取项目配置
 * @returns
 */
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

/**
 * 文件大小(M)
 * @param num 多少M
 * @returns
 */
export const getM = (num: number) => 1024 * 1024 * num;

/**
 * 文件大小(G)
 * @param num 多少G
 * @returns
 */
export const getG = (num: number) => 1024 * 1024 * 1024 * num;