import axios, {
  AxiosInstance,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig
} from 'axios'
import { UserApi } from './user'
import { EmailApi } from './email'
import { UploadApi } from './upload'
export class Api {
  request: AxiosInstance
  user: UserApi
  email: EmailApi
  upload: UploadApi
  constructor(config?: CreateAxiosDefaults) {
    this.request = this.#_create({
      baseURL: import.meta.env.VITE_API_URL,
      timeout: 5000,
      ...config
    })
    this.interceptorRequest()
    this.interceptorResponse()
    this.user = new UserApi(this.request)
    this.email = new EmailApi(this.request)
    this.upload = new UploadApi(this.request)
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
        const data = response.data
        if (data.code === 200 || data.code === 201) {
          return data
        }
        return Promise.reject(data)
      },
      (error) => {
        return Promise.reject(error)
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
