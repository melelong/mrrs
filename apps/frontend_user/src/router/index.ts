import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './modules'
import { usePermission } from './permission'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
usePermission(router)
export default router
