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
import { UpdateUserPasswordDto } from './interfaces/user/update-user-password.interface'
export class UserApi {
  constructor(private readonly request: AxiosInstance) {}
  /**
   * 注册验证码
   * @param address 邮箱地址
   * @returns
   */
  async userRegisterCaptcha(address: CaptchaDto['address']) {
    return await this.request.get('/api/user/register-captcha', {
      params: {
        address
      }
    })
  }

  /**
   * 注册
   * @param data 注册接口请求参数格式
   * @returns
   */
  async userRegister(data: RegisterUserDto) {
    return await this.request.post('/api/user/register', data)
  }

  /**
   * 普通用户登录
   * @param data 登录接口请求参数格式
   * @returns
   */
  async userLogin(data: LoginUserDto) {
    return await this.request.post('/api/user/login', data)
  }

  /**
   * 普通用户登录验证码
   * @returns
   */
  async userLoginCaptcha() {
    return await this.request.get('api/user/res/userCaptcha')
  }

  /**
   * 修改密码功能邮件验证码
   * @param address 邮箱地址
   * @returns
   */
  async userUpdateUserPasswordCaptcha(address: CaptchaDto['address']) {
    return await this.request.get('api/user/update_password/captcha', {
      params: {
        address
      }
    })
  }

  /**
   * 修改密码
   * @param data 修改密码接口请求参数格式
   * @returns
   */
  async userUpdateUserPassword(data: UpdateUserPasswordDto) {
    return await this.request.post('api/user/update_password', data)
  }
}
