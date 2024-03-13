import { crypto } from '@repo/utils/es'
import { useCache } from '@/hooks/useCache'
const SALT1 = 'melelong'
const SALT2 = '会议室预订系统'
const KEY = crypto.wordArray(SALT1)
const IV = crypto.wordArray(SALT2)
// 操作缓存
const { CookiesCache, SessionCache, LocalCache } = useCache
/**
 * 删除信息缓存
 * @param cacheKey 缓存名
 */
export const delInfoCache = function (cacheKey: string) {
  // cookies
  CookiesCache.del(cacheKey)
  // sessionStorage
  SessionCache.del(cacheKey)
  // localStorage
  LocalCache.del(cacheKey)
}
/**
 * 设置信息缓存(ValueType是值类型)
 * @param that 状态的this
 * @param cacheKey 缓存名
 * @param storeKey 状态名
 * @param value 值
 */
export const setInfoCache = function <ValueType>(
  that: any,
  cacheKey: string,
  storeKey: string,
  value: ValueType
) {
  // _开头的是密文
  const _value = crypto.aesEncryption(JSON.stringify(value), KEY, IV)
  // 内存
  that[storeKey] = value
  // cookies
  CookiesCache.set(cacheKey, _value)
  // sessionStorage
  SessionCache.set(cacheKey, _value)
  // localStorage
  LocalCache.set(cacheKey, _value)
}
/**
 * 获取信息缓存(ValueType是值类型)
 * @param that 状态的this
 * @param cacheKey 缓存名
 * @param storeKey 状态名
 * @param value 状态值
 * @param defaultValue 默认值
 * @returns
 */
export const getInfoCache = function <ValueType>(
  that: any,
  cacheKey: string,
  storeKey: string,
  value: ValueType,
  defaultValue: ValueType
): ValueType {
  // 内存
  if (value !== null) return value
  // cookies
  const cookie = CookiesCache.get(cacheKey)
  if (cookie) {
    // _开头是明文
    const _cookie = JSON.parse(crypto.aesDecrypt(cookie, KEY, IV))
    that[storeKey] = _cookie
    SessionCache.set(cacheKey, cookie)
    LocalCache.set(cacheKey, cookie)
    return _cookie as ValueType
  }
  // sessionStorage
  const session = SessionCache.get(cacheKey)
  if (session) {
    // _开头是明文
    const _session = JSON.parse(crypto.aesDecrypt(session, KEY, IV))
    that[storeKey] = _session
    CookiesCache.set(cacheKey, session)
    LocalCache.set(cacheKey, session)
    return _session as ValueType
  }
  // localStorage
  const local = LocalCache.get(cacheKey)
  if (local) {
    // _开头是明文
    const _local = JSON.parse(crypto.aesDecrypt(local, KEY, IV))
    that[storeKey] = _local
    CookiesCache.set(cacheKey, local)
    SessionCache.set(cacheKey, local)
    return _local as ValueType
  }
  // 默认值
  return defaultValue
}
/**
 * 删除Token缓存
 * @param key 缓存名
 */
export const delTokenCache = function (cacheKey: string) {
  // sessionStorage
  SessionCache.del(cacheKey)
  // localStorage
  LocalCache.del(cacheKey)
}
/**
 * 设置Token缓存(ValueType是值类型)
 * @param that 状态的this
 * @param cacheKey 缓存名
 * @param storeKey 状态名
 * @param value 值
 */
export const setTokenCache = function (
  that: any,
  cacheKey: string,
  storeKey: string,
  value: string
) {
  // 内存
  that[storeKey] = value
  // sessionStorage
  SessionCache.set(cacheKey, value)
  // localStorage
  LocalCache.set(cacheKey, value)
}
/**
 * 获取Token缓存(ValueType是值类型)
 * @param that 状态的this
 * @param cacheKey 缓存名
 * @param storeKey 状态名
 * @param value 状态值
 * @param defaultValue 默认值
 * @returns
 */
export const getTokenCache = function <ValueType>(
  that: any,
  cacheKey: string,
  storeKey: string,
  value: ValueType,
  defaultValue: ValueType
): ValueType {
  // 内存
  if (value !== null) return value
  // sessionStorage
  const session = SessionCache.get(cacheKey)
  if (session) {
    that[storeKey] = session
    LocalCache.set(cacheKey, session)
    return session as ValueType
  }
  // localStorage
  const local = LocalCache.get(cacheKey)
  if (local) {
    that[storeKey] = local
    SessionCache.set(cacheKey, local)
    return local as ValueType
  }
  // 默认值
  return defaultValue
}
