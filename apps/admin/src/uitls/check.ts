/**
 * 存储类型
 */
export type StorageType = {
  localStorage: boolean
  sessionStorage: boolean
  indexedDB: boolean
  webSql: boolean
}
/**
 * 环境类型
 */
export type EnvType = {
  Storage: StorageType
}
/**
 * 检测环境
 * @returns
 */
export function checkEnv(): EnvType {
  return {
    Storage: {
      localStorage: !!localStorage,
      sessionStorage: !!sessionStorage,
      indexedDB: !!indexedDB,
      webSql: !!(window as any).openDatabase
    }
  }
}
