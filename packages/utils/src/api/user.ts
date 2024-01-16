/*
 * 2023-12-16 00:34:29
 * @Github: https://github.com/melelong
 * custom_string_obkoro1~custom_string_obkoro100都可以输出自定义信息
 * @Author: melelong
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 * @LastEditors: 可以输入预定的版权声明、个性签名、空行等
 */
import { AxiosInstance } from 'axios'
import { CaptchaDto } from './interfaces/user/captcha.interface'
import { RegisterUserDto } from './interfaces/user/register-user.interface'
import { LoginUserDto } from './interfaces/user/login-user.interface'
export class UserApi {
  constructor(private readonly request: AxiosInstance) {}
  // 注册验证码
  async userRegisterCaptcha(address: CaptchaDto['address']) {
    return await this.request.get('/api/user/register-captcha', {
      params: {
        address
      }
    })
  }
  // 注册
  async userRegister(data: RegisterUserDto) {
    return await this.request.post('/api/user/register', data)
  }
  // 登录
  async userLogin(data: LoginUserDto) {
    return await this.request.post('/api/user/login', data)
  }
  // 登录验证码
  async userLoginCaptcha() {
    return await this.request.get('api/user/res/userCaptcha')
  }
}
