/**
 * 获取用户列表接口请求参数格式
 */
export interface UserList {
  pageNo: number
  pageSize: number
  username: string
  nickName: string
  email: string
}
