import { type RouteRecordRaw } from 'vue-router'
import { LAYOUT, USER } from '@/router/constant'
/**
 * 用户页路由
 */
const UserRouters: RouteRecordRaw = {
  path: '/user',
  name: 'user',
  component: LAYOUT,
  meta: {
    requiresAuth: true,
    title: '用户'
  },
  children: [
    {
      path: 'update_info',
      name: 'updateInfo',
      component: USER
    }
  ]
}

export default UserRouters
