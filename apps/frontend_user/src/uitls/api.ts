import { Api } from '@repo/utils/es'
import { useTokenStore } from '@/stores/useTokenStore'
export const userApi = (() => {
  const _userApi = new Api({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
  })
  // 响应码处理
  const handleError = {
    401: async (config: any, data: any) => {
      const tokenStore = useTokenStore()
      // 尝试获取刷新token
      const oldRefreshToken = tokenStore.getRefreshToken
      try {
        const {
          data: { accessToken, refreshToken }
        } = await userApi.user.refresh(oldRefreshToken!)
        tokenStore.setAccessToken(accessToken)
        tokenStore.setRefreshToken(refreshToken)
        config.headers.Authorization = `Bearer ${accessToken}`
        config.__isRetry = true
        return await _userApi.request.request(config)
      } catch (error) {
        await tokenStore.LogOut()
        return Promise.reject(data)
      }
    }
  }
  _userApi.request.interceptors.request.use((config) => {
    const tokenStore = useTokenStore()
    const accessToken = tokenStore.getAccessToken
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  })
  _userApi.request.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
      const {
        response: {
          data: { code },
          data
        },
        config
      } = error
      // 访问token失效
      if (code === 401 && config && !config.__isRetry) {
        return await handleError[401](config, data)
      }
      return Promise.reject(data)
    }
  )
  return _userApi
})()
