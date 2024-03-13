import { type RouteRecordRaw } from 'vue-router'
import { HOME, LAYOUT } from '@/router/constant'
/**
 * 首页路由
 */
const HomeRouters: RouteRecordRaw = {
  path: '/home',
  component: LAYOUT,
  meta: {
    requiresAuth: true,
    icon: 'AppstoreOutlined',
    title: '首页'
  },
  children: [
    {
      path: '',
      name: 'home',
      component: HOME
    }
  ]
}

export default HomeRouters
