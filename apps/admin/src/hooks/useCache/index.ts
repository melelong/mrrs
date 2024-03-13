import Cookies from 'js-cookie'
/**
 * 缓存环境类型
 */
type CacheEnvType = {
  cookie: boolean
  localStorage: boolean
  sessionStorage: boolean
}
/**
 * 缓存类型
 */
type CacheType = {
  get: ((key: string) => string | undefined) | ((key: string) => string | null)
  set: ((key: string, value: string) => string | undefined) | ((key: string, value: string) => void)
  del: (key: string) => void
}
/**
 * 缓存对象类型
 */
type CacheObjType = {
  CookiesCache: CacheType
  LocalCache: CacheType
  SessionCache: CacheType
}
/**
 * 获取cookies操作对象
 * @returns
 */
export function useCookiesCache(): CacheType {
  return {
    get: (key: string) => Cookies.get(key),
    set: (key: string, value: string) => Cookies.set(key, value),
    del: (key: string) => Cookies.remove(key)
  }
}
/**
 * 获取localStorage操作对象
 * @returns
 */
export function useLocalCache(): CacheType {
  return {
    get: (key: string) => localStorage.getItem(key),
    set: (key: string, value: string) => localStorage.setItem(key, value),
    del: (key: string) => localStorage.removeItem(key)
  }
}
/**
 * 获取sessionStorage操作对象
 * @returns
 */
export function useSessionCache(): CacheType {
  return {
    get: (key: string) => sessionStorage.getItem(key),
    set: (key: string, value: string) => sessionStorage.setItem(key, value),
    del: (key: string) => sessionStorage.removeItem(key)
  }
}
/**
 * 检测环境
 * @returns
 */
function _check(): CacheEnvType {
  return {
    cookie: 'cookie' in document,
    localStorage: 'localStorage' in window,
    sessionStorage: 'sessionStorage' in window
  }
}
export const useCache = (function () {
  let fnCache = null
  const cacheEnv = _check()
  const init = function () {
    const cacheObj = {} as CacheObjType
    if (cacheEnv.cookie) {
      cacheObj.CookiesCache = useCookiesCache()
    }
    if (cacheEnv.sessionStorage) {
      cacheObj.SessionCache = useSessionCache()
    }
    if (cacheEnv.localStorage) {
      cacheObj.LocalCache = useLocalCache()
    }
    return cacheObj
  }
  if (fnCache) return fnCache
  fnCache = init()
  return fnCache
})()
