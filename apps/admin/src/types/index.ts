// 登录表单
export type LoginUser = {
  username: string
  password: string
  captcha: string
}
// 注册表单
export type RegisterUser = {
  username: string
  nickName: string
  password: string
  email: string
  captcha: string
}
// 更新用户信息表单
export type UpdateUser = {
  headPic?: string
  nickName?: string
  email: string
  captcha: string
}
// 更新密码表单
export type UpdateUserPassword = {
  password: string
  email: string
  captcha: string
}
export type formRefType = LoginUser | RegisterUser | UpdateUser | UpdateUserPassword
