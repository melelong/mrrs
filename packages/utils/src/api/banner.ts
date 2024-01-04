/*
 * 2023-12-16 00:34:29
 * @Github: https://github.com/melelong
 * custom_string_obkoro1~custom_string_obkoro100都可以输出自定义信息
 * @Author: melelong
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 * @LastEditors: 可以输入预定的版权声明、个性签名、空行等
 */
import { api } from './api';
export const bannerApi = {
  getBanner: () => api.get('/api/banner'),
  addBanner: (data: Record<string, any>) => api.post('/api/banner', data),
};
