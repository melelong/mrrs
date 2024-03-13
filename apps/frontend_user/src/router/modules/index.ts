import type { RouteRecordRaw } from 'vue-router'
import { ErrorRouter, RootRouter, basicRouters } from './basic'
const modules = import.meta.glob('./**/*.ts', { eager: true })
// 二维数组扁平化
const moduleRoutes: RouteRecordRaw[] = []
Object.keys(modules).forEach((key) => {
  const module = (modules as Recordable)[key].default || ''
  if (module !== '') {
    moduleRoutes.push(module)
  }
})
export const routes = [...basicRouters, RootRouter, ...moduleRoutes, ErrorRouter]
