import { defineStore } from 'pinia'
import { getInfoCache, setInfoCache } from './storesHelp'
/**
 * 缓存名
 */
export const KEYNAME = {
  // 屏幕大小类型信息
  sizeType: 'SIZE_TYPE',
  // 侧边栏关闭时宽度信息
  collapsedWidth: 'COLLAPSED_WIDTH',
  // 侧边栏生成项信息
  siderItems: 'SIDER_ITEMS',
  // 用户菜单生成项信息
  headerItmes: 'HEADER_ITMES',
  // 页面缓存列表信息
  cacheList: 'CACHE_LIST'
}
export const useAppStore = defineStore('app', {
  /**
   * 应用状态
   * @returns
   */
  state: (): AppStore => ({
    // 需要加密
    sizeType: null,
    collapsedWidth: null,
    siderItems: null,
    headerItmes: null,
    cacheList: null,
    // 不需要加密和不需要缓存到本地
    collapsed: null,
    visible: null
  }),
  getters: {
    /**
     * 获取屏幕大小类型信息
     * @param param0 屏幕大小类型信息
     * @returns
     */
    getSizeType({ sizeType }): AppStore['sizeType'] {
      return getInfoCache<AppStore['sizeType']>(this, KEYNAME.sizeType, 'sizeType', sizeType, '')
    },
    /**
     * 获取侧边栏关闭时宽度信息
     * @param param0 侧边栏关闭时宽度信息
     * @returns
     */
    getCollapsedWidth({ collapsedWidth }): AppStore['collapsedWidth'] {
      return getInfoCache<AppStore['collapsedWidth']>(
        this,
        KEYNAME.collapsedWidth,
        'collapsedWidth',
        collapsedWidth,
        80
      )
    },
    /**
     * 获取侧边栏状态信息(不需要缓存到本地)
     * @param param0 侧边栏状态信息
     */
    getCollapsed({ collapsed }): AppStore['collapsed'] {
      // 内存
      if (collapsed !== null) return collapsed
      // 默认值
      return false
    },
    /**
     * 获取侧边栏生成项信息
     * @param param0 侧边栏生成项信息
     */
    getSiderItems({ siderItems }): AppStore['siderItems'] {
      return getInfoCache<AppStore['siderItems']>(
        this,
        KEYNAME.siderItems,
        'siderItems',
        siderItems,
        []
      )
    },
    /**
     * 获取用户菜单状态信息(不需要缓存到本地)
     * @param param0 用户菜单状态信息
     * @returns
     */
    getVisible({ visible }): AppStore['visible'] {
      // 内存
      if (visible !== null) return visible
      // 默认值
      return false
    },
    /**
     * 获取用户菜单生成项信息
     * @param param0 用户菜单生成项信息
     * @returns
     */
    getHeaderItmes({ headerItmes }): AppStore['headerItmes'] {
      return getInfoCache<AppStore['headerItmes']>(
        this,
        KEYNAME.headerItmes,
        'headerItmes',
        headerItmes,
        []
      )
    },
    /**
     * 获取页面缓存列表信息
     * @param param0 页面缓存列表信息
     * @returns
     */
    getCacheList({ cacheList }): AppStore['cacheList'] {
      return getInfoCache<AppStore['cacheList']>(
        this,
        KEYNAME.cacheList,
        'cacheList',
        cacheList,
        []
      )
    }
  },
  actions: {
    /**
     * 设置屏幕大小类型信息
     * @param value 屏幕大小类型信息
     */
    setSizeType(value: AppStore['sizeType']) {
      setInfoCache<AppStore['sizeType']>(this, KEYNAME.sizeType, 'sizeType', value)
    },
    /**
     * 设置侧边栏关闭时宽度信息
     * @param value 侧边栏关闭时宽度信息
     */
    setCollapsedWidth(value: AppStore['collapsedWidth']) {
      setInfoCache<AppStore['collapsedWidth']>(
        this,
        KEYNAME.collapsedWidth,
        'collapsedWidth',
        value
      )
    },
    /**
     * 设置侧边栏状态信息(不需要缓存到本地)
     * @param value 侧边栏状态信息
     */
    setCollapsed(value: AppStore['collapsed']) {
      // 内存
      this.collapsed = value
    },
    /**
     * 设置侧边栏生成项信息
     * @param value 侧边栏生成项信息
     */
    setSiderItems(value: AppStore['siderItems']) {
      setInfoCache<AppStore['siderItems']>(this, KEYNAME.siderItems, 'siderItems', value)
    },
    /**
     * 设置用户菜单状态信息(不需要缓存到本地)
     * @param value 用户菜单状态信息
     */
    setVisible(value: AppStore['visible']) {
      // 内存
      this.visible = value
    },
    /**
     * 设置用户菜单生成项信息
     * @param value 用户菜单生成项信息
     */
    setHeaderItmes(value: AppStore['headerItmes']) {
      setInfoCache<AppStore['headerItmes']>(this, KEYNAME.headerItmes, 'headerItmes', value)
    },
    /**
     * 设置页面缓存列表信息
     * @param value 页面缓存列表信息
     */
    setCacheList(value: AppStore['cacheList']) {
      setInfoCache<AppStore['cacheList']>(this, KEYNAME.cacheList, 'cacheList', value)
    }
  }
})
