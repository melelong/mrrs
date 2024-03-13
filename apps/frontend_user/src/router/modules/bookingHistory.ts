import { type RouteRecordRaw } from 'vue-router'
import { BOOKING_HISTORY, LAYOUT } from '@/router/constant'
/**
 * 预订历史页路由
 */
const BookingHistoryRouters: RouteRecordRaw = {
  path: '/bookingHistory',
  component: LAYOUT,
  meta: {
    requiresAuth: true,
    icon: 'CalendarOutlined',
    title: '预订历史'
  },
  children: [
    {
      path: '',
      name: 'bookingHistory',
      component: BOOKING_HISTORY
    }
  ]
}
export default BookingHistoryRouters
