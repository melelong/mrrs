import * as antIcons from '@ant-design/icons-vue'
import * as ParkIcons from '@icon-park/vue-next'
/**
 * 操作icon
 * @returns
 */
export function useIcon() {
  return {
    /**
     * 动态获取ant-design的icon
     * @param iconName icon名
     * @returns
     */
    getAntIcon: function (iconName: string) {
      return (antIcons as Recordable)[iconName]
    },
    /**
     * 动态获取icon-park的icon
     * @param iconName icon名
     * @returns
     */
    getParkIcon: function (iconName: string) {
      return (ParkIcons as Recordable)[iconName]
    }
  }
}
