import { MD5, enc } from 'crypto-js';

export function md5(str: string) {
  return MD5(str).toString(enc.Hex);
}