import api from './api';
// 用户模块
export const userApi = {
  // 普通用户登录
  login: (data: Record<string, any>) => api.post('/api/banner', data),
  // 普通用户注册
  register: (data: Record<string, any>) => api.post('/api/user/register', data),
  // 普通用户个人信息修改
  update: (data: Record<string, any>) => api.post('/api/user/update', data),
  // 普通用户修改密码
  update_password: (data: Record<string, any>) =>
    api.post('/api/user/update_password', data),
  // 管理员登录
  admin_login: (data: Record<string, any>) =>
    api.post('/api/user/admin/login', data),
  // 管理员修改密码
  admin_update_password: (data: Record<string, any>) =>
    api.post('/api/user/admin/update_password', data),
  // 管理员个人信息修改
  admin_update: (data: Record<string, any>) =>
    api.post('/api/user/admin/update', data),
  // 用户列表
  list: () => api.get('/api/user/list'),
  // 冻结用户
  freeze: () => api.get('/api/user/freeze'),
};
