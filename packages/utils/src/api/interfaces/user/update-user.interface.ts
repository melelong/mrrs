/**
 * 更新用户信息接口请求参数格式
 */
export interface UpdateUserDto {
  headPic?: string

  nickName?: string

  email: string

  captcha: string
}
