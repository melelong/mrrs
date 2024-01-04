// 全局工具方法
import { crypto } from '@repo/utils';
export function md5(str: string): string {
  return crypto.md5(str);
}
