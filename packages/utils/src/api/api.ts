/*
 * 2024-01-04 15:21:41
 * @Github: https://github.com/melelong
 * custom_string_obkoro1~custom_string_obkoro100都可以输出自定义信息
 * @Author: melelong
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 * @LastEditors: 可以输入预定的版权声明、个性签名、空行等
 */
import axios, {
  AxiosInstance,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig
} from 'axios'
import { UserApi } from './user'

export class Api {
  request: AxiosInstance
  user: UserApi
  constructor(config?: CreateAxiosDefaults) {
    this.request = this.#_create({
      baseURL: import.meta.env.VITE_API_URL,
      timeout: 5000,
      ...config
    })
    this.interceptorRequest()
    this.interceptorResponse()
    this.user = new UserApi(this.request)
  }
  #_create(config?: CreateAxiosDefaults): AxiosInstance {
    return axios.create(config)
  }
  interceptorRequest() {
    this.request.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 加密处理
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }
  interceptorResponse() {
    this.request.interceptors.response.use(
      (response: AxiosResponse) => {
        // 解密处理
        if (response?.status === 200 || response?.status === 201) return response?.data
        return Promise.reject(response?.data)
      },
      ({ response }) => {
        return Promise.reject(response.data)
      }
    )
  }
  async get(url: string, params?: object): Promise<AxiosResponse> {
    return await this.request.get(url, params)
  }
  async post(url: string, data?: object): Promise<AxiosResponse> {
    return await this.request.post(url, data)
  }
  async put(url: string, data?: object): Promise<AxiosResponse> {
    return this.request.put(url, data)
  }
  async delete(url: string, data?: object): Promise<AxiosResponse> {
    return this.request.delete(url, data)
  }
}
