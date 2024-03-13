import { type RouteRecordRaw } from 'vue-router'
import { MEETING_ROOM_LIST, LAYOUT } from '@/router/constant'
/**
 * 会议室列表路由
 */
const MeetingRoomListRouters: RouteRecordRaw = {
  path: '/meetingRoomList',
  component: LAYOUT,
  meta: {
    requiresAuth: true,
    icon: 'AppstoreOutlined',
    title: '会议室列表'
  },
  children: [
    {
      path: '',
      name: 'meetingRoomList',
      component: MEETING_ROOM_LIST
    }
  ]
}

export default MeetingRoomListRouters
