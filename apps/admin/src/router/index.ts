/*
 * 2024-01-09 21:07:33
 * @Github: https://github.com/melelong
 * custom_string_obkoro1~custom_string_obkoro100都可以输出自定义信息
 * @Author: melelong
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 * @LastEditors: 可以输入预定的版权声明、个性签名、空行等
 */
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomePage.tsx')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginPage.tsx')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterPage.tsx')
    },
    {
      path: '/update_password',
      name: 'update_password',
      component: () => import('../views/UpdatePasswordPage.tsx')
    },
    {
      path: '/:catchAll(.*)',
      component: () => import('../views/ErrorPage.tsx')
    }
  ]
})

export default router
