import api from './api';
// 会议室管理模块
export const meetingRoomApi = {
  // 会议室列表
  list: () => api.get('/api/meeting_room/list'),
  // 会议室删除
  delete: () => api.delete('/api/meeting_room/delete/:id'),
  // 会议室更新
  update: () => api.put('/api/meeting_room/update/:id'),
  // 会议室新增
  create: () => api.post('/api/meeting_room/create'),
  // 会议室搜索
  search: () => api.get('/api/meeting_room/search'),
};
