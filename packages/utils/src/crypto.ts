import { MD5, enc } from 'crypto-js';

export const md5 = (str: string): string => MD5(str).toString(enc.Hex);
