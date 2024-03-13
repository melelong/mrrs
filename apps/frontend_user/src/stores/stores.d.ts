/**
 * 应用状态类型
 */
type AppStore = {
  // App
  sizeType: null | ('' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl')
  // Sider
  collapsedWidth: null | (0 | 80)
  collapsed: null | boolean
  siderItems: null | any[]
  // Header
  visible: null | boolean
  headerItmes: null | any[]
  // Content
  cacheList?: null | any[]
}
/**
 * token状态类型
 */
type TokenStore = {
  userInfo: any | null
  roles: string[] | null
  permissions: any[] | null
  accessToken: string | null
  refreshToken: string | null
}
