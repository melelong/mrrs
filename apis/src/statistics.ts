import api from './api';
// 统计模块
export const statisticsApi = {
  // 	会议室使用频率统计
  meeting_room_usage_frequency: () => api.get('/api/banner'),
  // 	用户预订频率统计
  user_booking_frequency: () => api.get('/api/user/register'),
};
