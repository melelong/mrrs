import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      alias: '/login',
      name: 'LoginPage',
      component: () => import('@/views/LoginPage.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/HomePage.vue'),
      children: [
        {
          path: '/BookingManagement',
          alias: ['', 'BookingManagement'],
          name: 'BookingManagement',
          component: () => import('@/pages/BookingManagement.vue')
        },
        {
          path: '/UserManagement',
          alias: ['UserManagement'],
          name: 'UserManagement',
          component: () => import('@/pages/UserManagement.vue')
        },
        {
          path: '/StatisticsPage',
          alias: ['StatisticsPage'],
          name: 'StatisticsPage',
          component: () => import('@/pages/StatisticsPage.vue')
        }
      ]
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterPage.vue')
    },
    {
      path: '/update_password',
      name: 'update_password',
      component: () => import('@/views/UpdatePasswordPage.vue')
    },
    {
      path: '/:catchAll(.*)',
      component: () => import('@/views/ErrorPage.vue')
    }
  ]
})

export default router
