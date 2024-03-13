import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import type { Router } from 'vue-router'
NProgress.configure({ showSpinner: false })
/**
 * 路由鉴权
 * @param router
 */
export function usePermission(router: Router) {
  router.beforeEach((to, from, next) => {
    NProgress.start()
    console.log('1', to)
    console.log('2', from)
    next()
  })
  router.afterEach(() => {
    NProgress.done()
  })
}
