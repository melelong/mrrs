/**
 * 修改密码接口请求参数格式
 */
export interface UpdateUserPasswordDto {
  username: string

  password: string

  email: string

  captcha: string
}
