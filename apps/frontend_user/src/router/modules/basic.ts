import { LOGIN, REGISTER, UPDATE_PASSWORD, ERROR, PAGE_ROUTERS, LAYOUT } from '@/router/constant'
import { type RouteRecordRaw } from 'vue-router'
/**
 * 根路由
 */
export const RootRouter: RouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PAGE_ROUTERS.BASE_HOME
}
/**
 * 错误页路由
 */
export const ErrorRouter: RouteRecordRaw = {
  path: '/:catchAll(.*)',
  name: 'ErrorPage',
  component: LAYOUT,
  children: [
    {
      path: '/:catchAll(.*)',
      name: 'ErrorPageContent',
      component: ERROR
    }
  ]
}
/**
 * 基础路由
 */
export const basicRouters: RouteRecordRaw[] = [
  {
    path: '/login',
    alias: '/login',
    name: 'LoginPage',
    component: LOGIN,
    meta: {
      hidden: true
    }
  },
  {
    path: '/register',
    name: 'RegisterPage',
    component: REGISTER
  },
  {
    path: '/update_password',
    name: 'UpdatePasswordPage',
    component: UPDATE_PASSWORD
  }
]
