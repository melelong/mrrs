/*
 * 2024-01-02 23:54:43
 * @Github: https://github.com/melelong
 * custom_string_obkoro1~custom_string_obkoro100都可以输出自定义信息
 * @Author: melelong
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 * @LastEditors: 可以输入预定的版权声明、个性签名、空行等
 */
import { HmacMD5, enc, AES, mode, lib, pad, HmacSHA256 } from 'crypto-js'
/**
 * MD5(哈希碰撞几率大)
 * @param str 明文
 * @param key 盐
 * @returns {string} 哈希值
 */
export const md5 = (str: string, salt: lib.WordArray): string =>
  HmacMD5(str, salt).toString(enc.Hex)
/**
 * SHA256(哈希碰撞几率少)
 * @param str 明文
 * @param key 盐
 * @returns {string} 哈希值
 */
export const sha256 = (str: string, salt: lib.WordArray): string =>
  HmacSHA256(str, salt).toString(enc.Hex)
/**
 * AES加密
 * @param str 明文
 * @param key 密钥
 * @param iv IV
 * @returns {string} 密文
 */
export const aesEncryption = (str: string, key: lib.WordArray, iv: lib.WordArray): string =>
  AES.encrypt(str, key, {
    mode: mode.CBC,
    padding: pad.Pkcs7,
    iv
  }).toString()
/**
 * AES解密
 * @param str 密文
 * @param key 密钥
 * @param iv IV
 * @returns {string} 明文
 */
export const aesDecrypt = (str: string, key: lib.WordArray, iv: lib.WordArray): string =>
  AES.decrypt(str, key, {
    mode: mode.CBC,
    padding: pad.Pkcs7,
    iv
  }).toString(enc.Utf8)
/**
 * 字符串转WordArray
 * @param str 明文
 * @returns {lib.WordArray} WordArray
 */
export const wordArray = (str: string): lib.WordArray => enc.Hex.parse(str)
