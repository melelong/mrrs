import api from './api';
// 预订管理模块
export const bookingApi = {
  // 预订列表
  list: () => api.get('/api/booking/list'),
  // 审批预订申请
  approve: () => api.post('/api/booking/approve'),
  // 申请预订
  add: () => api.post('/api/booking/add'),
  // 通过预订
  apply: () => api.get('/api/booking/apply/:id'),
  // 取消预订
  reject: () => api.get('/api/booking/reject/:id'),
  // 解除预订
  unbind: () => api.get('/api/booking/unbind/:id'),
  // 预订历史
  history: () => api.get('/api/booking/history'),
  // 催办
  urge: () => api.get('/api/booking/urge'),
};
