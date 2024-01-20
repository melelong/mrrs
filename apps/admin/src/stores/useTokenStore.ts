import { crypto } from '@repo/utils/es'
import { defineStore } from 'pinia'
/**
 * token状态类型
 */
type TokenStore = {
  userInfo: any
  accessToken: string
  refreshToken: string
}
const SALT1 = 'melelong'
const SALT2 = '会议室预订系统'
const KEY = crypto.wordArray(SALT1)
const IV = crypto.wordArray(SALT2)
export const useTokenStore = defineStore('token', {
  /**
   * token状态
   * @returns
   */
  state: (): TokenStore => ({
    // 需要加密
    userInfo: {},
    // 不需要加密
    accessToken: '',
    refreshToken: ''
  }),
  getters: {
    /**
     * 获取用户信息
     * @param param0 用户信息
     * @returns
     */
    getUserInfo({ userInfo }): TokenStore['userInfo'] {
      // 缓存
      if (JSON.stringify(userInfo) !== '{}') return userInfo
      // sessionStorage
      const session = sessionStorage.getItem('USER_INFO')
      if (session) {
        // _开头是明文
        const _session = JSON.parse(crypto.aesDecrypt(session, KEY, IV))
        this.userInfo = _session
        localStorage.setItem('USER_INFO', session)
        return _session
      }
      // localStorage
      const local = localStorage.getItem('USER_INFO')
      if (local) {
        // _开头是明文
        const _local = JSON.parse(crypto.aesDecrypt(local, KEY, IV))
        this.userInfo = _local
        sessionStorage.setItem('USER_INFO', local)
        return _local
      }
      return {}
    },
    /**
     * 获取访问Token
     * @param param0 访问Token
     * @returns
     */
    getAccessToken({ accessToken }): TokenStore['accessToken'] {
      // 缓存
      if (accessToken !== '') return accessToken
      // sessionStorage
      const session = sessionStorage.getItem('ACCESS_TOKEN')
      if (session) {
        this.accessToken = session
        localStorage.setItem('ACCESS_TOKEN', session)
        return session
      }
      // localStorage
      const local = localStorage.getItem('ACCESS_TOKEN')
      if (local) {
        this.accessToken = local
        sessionStorage.setItem('ACCESS_TOKEN', local)
        return local
      }
      return ''
    },
    /**
     * 获取刷新Token
     * @param param0 刷新Token
     * @returns
     */
    getRefreshToken({ refreshToken }): TokenStore['refreshToken'] {
      // 缓存
      if (refreshToken !== '') return refreshToken
      // sessionStorage
      const session = sessionStorage.getItem('REFRESH_TOKEN')
      if (session) {
        this.refreshToken = session
        localStorage.setItem('REFRESH_TOKEN', session)
        return session
      }
      // localStorage
      const local = localStorage.getItem('REFRESH_TOKEN')
      if (local) {
        this.refreshToken = local
        sessionStorage.setItem('REFRESH_TOKEN', local)
        return local
      }
      return ''
    }
  },
  actions: {
    /**
     * 设置用户信息
     * @param newUserInfo 用户信息
     */
    async setUserInfo(newUserInfo: any) {
      // _开头的是密文
      const _newUserInfo = crypto.aesEncryption(JSON.stringify(newUserInfo), KEY, IV)
      // 缓存
      this.userInfo = newUserInfo
      // sessionStorage
      sessionStorage.setItem('USER_INFO', _newUserInfo)
      // localStorage
      localStorage.setItem('USER_INFO', _newUserInfo)
    },
    /**
     * 设置访问Token
     * @param newAccessToken 访问Token
     */
    async setAccessToken(newAccessToken: string) {
      // 缓存
      this.accessToken = newAccessToken
      // sessionStorage
      sessionStorage.setItem('ACCESS_TOKEN', newAccessToken)
      // localStorage
      localStorage.setItem('ACCESS_TOKEN', newAccessToken)
    },
    /**
     * 设置刷新Token
     * @param newRefreshToken 刷新Token
     */
    async setRefreshToken(newRefreshToken: string) {
      // 缓存
      this.refreshToken = newRefreshToken
      // sessionStorage
      sessionStorage.setItem('REFRESH_TOKEN', newRefreshToken)
      // localStorage
      localStorage.setItem('REFRESH_TOKEN', newRefreshToken)
    }
  }
})
