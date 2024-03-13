import { AxiosInstance } from 'axios'
import { CaptchaDto } from './interfaces/user/captcha.interface'
export class EmailApi {
  constructor(private readonly request: AxiosInstance) {}

  /**
   * 注册功能邮件验证码
   * @param address 邮箱地址
   * @returns
   */
  async registerCaptcha(address: CaptchaDto['address']) {
    return await this.request.get('/api/user/register-captcha', {
      params: {
        address
      }
    })
  }

  /**
   * 修改密码功能邮件验证码
   * @param address 邮箱地址
   * @returns
   */
  async updatePasswordCaptcha(address: CaptchaDto['address']) {
    return await this.request.get('api/user/update_password/captcha', {
      params: {
        address
      }
    })
  }

  /**
   * 修改用户信息功能邮件验证码
   * @param address 邮箱地址
   * @returns
   */
  async updateUserCaptcha(address: CaptchaDto['address']) {
    return await this.request.get('api/user/update/captcha', {
      params: {
        address
      }
    })
  }

  /**
   * 普通用户svg验证码
   * @returns
   */
  async userLoginCaptcha() {
    return await this.request.get('/api/user/res/userCaptcha')
  }

  /**
   * 管理员svg验证码
   * @returns
   */
  async adminLoginCaptcha() {
    return await this.request.get('/api/user/res/adminCaptcha')
  }
}
