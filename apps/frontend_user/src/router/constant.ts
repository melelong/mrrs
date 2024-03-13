/**
 * 页面路由
 */
export const PAGE_ROUTERS = {
  BASE_HOME: '/home',
  HEADER_MENUS: '/user',
  LOGIN: '/login',
  BOOKING_HISTORY: '/bookingHistory/index',
  MEETING_ROOM_LIST: '/meetingRoomList/index'
}
/**
 * 登录页组件
 */
export const LOGIN = () => import('@/views/LoginPage.vue')
/**
 * 注册页组件
 */
export const REGISTER = () => import('@/views/RegisterPage.vue')
/**
 * 修改密码页组件
 */
export const UPDATE_PASSWORD = () => import('@/views/UpdatePasswordPage.vue')
/**
 * 错误页组件
 */
export const ERROR = () => import('@/views/ErrorPage.vue')
/**
 * 布局组件
 */
export const LAYOUT = () => import('@/components/PageLayout/HomeLayout/index.vue')
/**
 * 首页组件
 */
export const HOME = () => import('@/views/Home/index.vue')
/**
 * 预订历史页组件
 */
export const BOOKING_HISTORY = () => import('@/views/BookingHistory/index.vue')
/**
 * 会议室列表页组件
 */
export const MEETING_ROOM_LIST = () => import('@/views/MeetingRoomList/index.vue')
/**
 * 用户页组件
 */
export const USER = () => import('@/views/User/index.vue')
