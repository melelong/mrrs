import { defineStore } from 'pinia'
import router from '@/router'
import { userApi } from '@/uitls'
import { message } from 'ant-design-vue'
import { PAGE_ROUTERS } from '@/router/constant'
import {
  getInfoCache,
  getTokenCache,
  setInfoCache,
  setTokenCache,
  delInfoCache,
  delTokenCache
} from './storesHelp'
/**
 * 缓存名
 */
const KEYNAME = {
  // 用户信息
  useInfo: 'USER_INFO',
  // 角色信息
  roles: 'ROLES',
  // 权限信息
  permissions: 'PERMISSIONS',
  // 访问token
  accessToken: 'ACCESS_TOKEN',
  // 刷新token
  refreshToken: 'REFRESH_TOKEN'
}
export const useTokenStore = defineStore('token', {
  /**
   * token状态
   * @returns
   */
  state: (): TokenStore => ({
    // 需要加密
    userInfo: null,
    roles: null,
    permissions: null,
    // 不需要加密
    accessToken: null,
    refreshToken: null
  }),
  getters: {
    /**
     * 获取用户信息
     * @param param0 用户信息
     * @returns
     */
    getUserInfo({ userInfo }): TokenStore['userInfo'] {
      return getInfoCache<TokenStore['userInfo']>(this, KEYNAME.useInfo, 'userInfo', userInfo, {})
    },
    /**
     * 获取角色信息
     * @param param0 角色信息
     * @returns
     */
    getRoles({ roles }): TokenStore['roles'] {
      return getInfoCache<TokenStore['roles']>(this, KEYNAME.roles, 'roles', roles, [])
    },
    /**
     * 设置权限信息
     * @param param0 权限信息
     * @returns
     */
    getPermissions({ permissions }): TokenStore['permissions'] {
      return getInfoCache<TokenStore['permissions']>(
        this,
        KEYNAME.permissions,
        'permissions',
        permissions,
        []
      )
    },
    /**
     * 获取访问Token
     * @param param0 访问Token
     * @returns
     */
    getAccessToken({ accessToken }): TokenStore['accessToken'] {
      return getTokenCache<TokenStore['accessToken']>(
        this,
        KEYNAME.accessToken,
        'accessToken',
        accessToken,
        ''
      )
    },
    /**
     * 获取刷新Token
     * @param param0 刷新Token
     * @returns
     */
    getRefreshToken({ refreshToken }): TokenStore['refreshToken'] {
      return getTokenCache<TokenStore['refreshToken']>(
        this,
        KEYNAME.refreshToken,
        'refreshToken',
        refreshToken,
        ''
      )
    }
  },
  actions: {
    /**
     * 设置用户信息
     * @param value 用户信息
     */
    setUserInfo(value: TokenStore['userInfo']) {
      setInfoCache<TokenStore['userInfo']>(this, KEYNAME.useInfo, 'userInfo', value)
    },

    /**
     * 设置角色信息
     * @param value 角色信息
     */
    setRoles(value: TokenStore['roles']) {
      setInfoCache<TokenStore['roles']>(this, KEYNAME.roles, 'roles', value)
    },

    /**
     * 设置权限信息
     * @param value 权限信息
     */
    setPermissions(value: TokenStore['permissions']) {
      setInfoCache<TokenStore['permissions']>(this, KEYNAME.permissions, 'permissions', value)
    },
    /**
     * 设置访问Token
     * @param value 访问Token
     */
    setAccessToken(value: TokenStore['accessToken']) {
      setTokenCache(this, KEYNAME.accessToken, 'accessToken', value!)
    },
    /**
     * 设置刷新Token
     * @param value 刷新Token
     */
    setRefreshToken(value: TokenStore['refreshToken']) {
      setTokenCache(this, KEYNAME.refreshToken, 'refreshToken', value!)
    },
    /**
     * 登出
     */
    async LogOut() {
      const { data } = await userApi.user.logOut()
      message.success(data)
      // 清除缓存
      this.$reset()
      // 用户信息
      delInfoCache(KEYNAME.useInfo)
      // 角色信息
      delInfoCache(KEYNAME.roles)
      // 权限信息
      delInfoCache(KEYNAME.permissions)
      // 访问Token
      delTokenCache(KEYNAME.accessToken)
      // 刷新Token
      delTokenCache(KEYNAME.refreshToken)
      // 返回登录页
      router.push(PAGE_ROUTERS.LOGIN)
    }
  }
})
