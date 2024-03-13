<!-- 组件名 -->
<script lang="ts">
export default {
  name: 'HomeSider'
}
</script>
<!-- 逻辑 -->
<script setup lang="ts">
import { debounce } from '@/uitls'
import { LayoutSider, Menu, type ItemType, type MenuTheme, Grid } from 'ant-design-vue'
import type { Breakpoint } from 'ant-design-vue/es/_util/responsiveObserve'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
/**
 * 组件属性
 */
type HomeSiderProps = {
  selectedKeys: (string | number)[]
  collapsed: boolean
  items: ItemType[]
  theme?: MenuTheme
  title: string
}
/**
 * 组件事件
 */
type HomeSiderEmits = {
  (e: 'showSider', value: boolean): void
  (e: 'selectedKeys', value: (string | number)[]): void
}
const props = defineProps<HomeSiderProps>()
// 控制侧边栏显示
const emits = defineEmits<HomeSiderEmits>()
const collapsedCref = computed(() => props.collapsed)

const selectedKeysCref = computed({
  get() {
    return props.selectedKeys
  },
  set(value) {
    emits('selectedKeys', value)
  }
})
// 主题
const themeCRef = computed(() => props.theme || 'light')
// 侧边栏
const useBreakpoint = Grid.useBreakpoint
const screens = useBreakpoint()
const sizeTypeRef = ref<string>('')
const collapsedWidthRef = ref<number>(80)
const isMackRef = computed(() => sizeTypeRef.value === 'xs' && !collapsedCref.value)
const handleShowSider = () => emits('showSider', !collapsedCref.value)
const handleClick = () => {
  if (sizeTypeRef.value === 'xs') emits('showSider', !collapsedCref.value)
}
// 更新屏幕大小类型
const updateSizeType = debounce(() => {
  const size = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl']
  for (let i: number = 0; i < size.length; i++) {
    const sizeName = size[i]
    const screensObj = screens.value
    if (screensObj[sizeName as Breakpoint]) {
      sizeTypeRef.value = size[i]
    }
  }
  emits('showSider', sizeTypeRef.value !== 'xl' && sizeTypeRef.value !== 'xxl')
  collapsedWidthRef.value = sizeTypeRef.value === 'xs' ? 0 : 80
}, 100)
// 监听
onMounted(() => {
  updateSizeType()
  window.addEventListener('resize', updateSizeType)
})
// 取消监听
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateSizeType)
})
</script>
<!-- 模板 -->
<template>
  <div
    :class="{
      homeSider_container: true,
      isMack: isMackRef
    }"
  >
    <LayoutSider
      class="shadow-xl h-screen z-[60] rounded"
      v-model:collapsed="collapsedCref"
      :trigger="null"
      collapsible
      :theme="themeCRef"
      :collapsedWidth="collapsedWidthRef"
    >
      <div class="homeSider_logo">{{ title }}</div>
      <Menu
        @click="handleClick"
        :items="items"
        mode="inline"
        :theme="themeCRef"
        v-model:selectedKeys="selectedKeysCref"
      ></Menu>
    </LayoutSider>
    <div class="homeSider_Mack" v-if="isMackRef" @click="handleShowSider"></div>
  </div>
</template>
<!-- 样式 -->
<style scoped>
.isMack {
  @apply fixed z-50;
}
.homeSider_logo {
  @apply text-center text-lg leading-[1.125rem]  font-bold text-[#1976D2] m-4;
}
.homeSider_Mack {
  @apply z-50 w-screen h-screen absolute top-0 left-0 bg-slate-400/[.5];
}
</style>
