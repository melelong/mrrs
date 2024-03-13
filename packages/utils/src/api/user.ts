import { AxiosInstance } from 'axios'
import { RegisterUserDto } from './interfaces/user/register-user.interface'
import { LoginUserDto } from './interfaces/user/login-user.interface'
import { UpdateUserPasswordDto } from './interfaces/user/update-user-password.interface'
import { UpdateUserDto } from './interfaces/user/update-user.interface'
import { UserList } from './interfaces/user/user-list'
export class UserApi {
  constructor(private readonly request: AxiosInstance) {}

  /**
   * 普通用户注册
   * @param data 注册接口请求参数格式
   * @returns
   */
  async register(data: RegisterUserDto) {
    return await this.request.post('/api/user/register', data)
  }

  /**
   * 用户登出
   * @returns
   */
  async logOut() {
    return await this.request.post('/api/user/logout')
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
   * 普通用户刷新短token
   * @returns
   */
  async refresh(refreshToken: string) {
    return await this.request.get('/api/user/refresh', {
      params: {
        refreshToken
      }
    })
  }

  /**
   * 管理员登录
   * @param data 登录接口请求参数格式
   * @returns
   */
  async adminLogin(data: LoginUserDto) {
    return await this.request.post('/api/user/admin/login', data)
  }

  /**
   * 管理员刷新短token
   * @returns
   */
  async adminRefresh(refreshToken: string) {
    return await this.request.get('/api/user/admin/refresh', {
      params: {
        refreshToken
      }
    })
  }

  /**
   * 获取用户信息
   * @returns
   */
  async info() {
    return await this.request.get('/api/user/info')
  }

  /**
   * 普通用户修改密码
   * @param data 修改密码接口请求参数格式
   * @returns
   */
  async userUpdateUserPassword(data: UpdateUserPasswordDto) {
    return await this.request.post('/api/user/update_password', data)
  }

  /**
   * 管理员修改密码
   * @param data 修改密码接口请求参数格式
   * @returns
   */
  async adminUpdateUserPassword(data: UpdateUserPasswordDto) {
    return await this.request.post('/api/user/admin/update_password', data)
  }

  /**
   * 修改普通用户信息
   * @param data 更新用户信息接口请求参数格式
   * @returns
   */
  async userUpdate(data: UpdateUserDto) {
    return await this.request.post('/api/user/update', data)
  }

  /**
   * 修改管理员信息
   * @param data 更新用户信息接口请求参数格式
   * @returns
   */
  async adminUpdate(data: UpdateUserDto) {
    return await this.request.post('/api/user/admin/update', data)
  }

  /**
   * 用户冻结
   * @param userId 用户ID
   * @returns
   */
  async freeze(userId: string) {
    return await this.request.get('/api/user/freeze', {
      params: {
        userId
      }
    })
  }

  /**
   * 获取用户列表
   * @param data 获取用户列表接口请求参数格式
   * @returns
   */
  async list(data: UserList) {
    return await this.request.get('/api/user/list', {
      params: {
        ...data
      }
    })
  }

  /**
   * 初始化数据
   * @returns
   */
  async initData() {
    return await this.request.get('/api/user/init-data')
  }
}
