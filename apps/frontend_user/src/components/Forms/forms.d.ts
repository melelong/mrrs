/**
 * 登录表单类型
 */
type LoginUser = {
  username: string
  password: string
  captcha: string
}

/**
 * 注册表单类型
 */
type RegisterUser = {
  username: string
  nickName: string
  password: string
  email: string
  captcha: string
}

/**
 * 更新用户信息表单类型
 */
type UpdateUser = {
  headPic?: string
  nickName?: string
  email: string
  captcha: string
}

/**
 * 更新密码表单类型
 */
type UpdateUserPassword = {
  username: string
  password: string
  email: string
  captcha: string
}

/**
 * 表单类型
 */
type formRefType = LoginUser | RegisterUser | UpdateUser | UpdateUserPassword
