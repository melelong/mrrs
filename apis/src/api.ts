/*
 * 2023-12-15 23:02:54
 * @Github: https://github.com/melelong
 * custom_string_obkoro1~custom_string_obkoro100都可以输出自定义信息
 * @Author: melelong
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 * @LastEditors: 可以输入预定的版权声明、个性签名、空行等
 */
import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
const api: AxiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: 'http://127.0.0.1:4523/m1/2445918-0-default',
});
// 请求拦截
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 加密处理
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
// 响应拦截
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // 解密处理
    if (response.status !== 200) Promise.reject(response);
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
