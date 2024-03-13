/*
 * 2024-01-10 23:51:25
 * @Github: https://github.com/melelong
 * custom_string_obkoro1~custom_string_obkoro100都可以输出自定义信息
 * @Author: melelong
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 * @LastEditors: 可以输入预定的版权声明、个性签名、空行等
 */
import { Api } from '@repo/utils/es'
export const adminApi = new Api({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
})
