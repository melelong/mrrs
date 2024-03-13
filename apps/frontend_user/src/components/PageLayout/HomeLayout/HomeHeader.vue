<!-- 组件名 -->
<script lang="ts">
export default {
  name: 'HomeHeader'
}
</script>
<!-- 逻辑 -->
<script setup lang="ts">
import { LayoutHeader, Dropdown, Menu, Avatar, type ItemType } from 'ant-design-vue'
import { UserOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'
import { useTokenStore } from '@/stores/useTokenStore'
import { computed } from 'vue'
const VITE_API_URL = import.meta.env.VITE_API_URL
/**
 * 组件属性
 */
type HomeHeaderProps = {
  visible: boolean
  collapsed: boolean
  items: ItemType[]
}
/**
 * 组件事件
 */
type HomeHeaderEmits = {
  (e: 'changeCollapsed', value: boolean): void
  (e: 'showSider', value: boolean): void
  (e: 'showMenu', value: boolean): void
}

const tokenState = useTokenStore()
const userInfo = computed(() => {
  const { username, headPic } = tokenState.getUserInfo
  const headPicPath = `${VITE_API_URL}${headPic}`
  return {
    headPic,
    username,
    headPicPath
  }
})
const props = defineProps<HomeHeaderProps>()
// 控制用户菜单显示
const visibleCref = computed({
  get: () => props.visible,
  set: (e: boolean) => {
    emits('showMenu', e)
  }
})
// 控制侧边栏显示
const collapsedCref = computed(() => props.collapsed)
const emits = defineEmits<HomeHeaderEmits>()
const handleShowSider = () => emits('showSider', !collapsedCref.value)
</script>
<!-- 模板 -->
<template>
  <LayoutHeader id="homeHeader_container">
    <menu-unfold-outlined v-if="collapsed" class="homeHeader_trigger" @click="handleShowSider" />
    <menu-fold-outlined v-else class="homeHeader_trigger" @click="handleShowSider" />
    <Dropdown v-model:open="visibleCref" :trigger="['click', 'hover']" placement="bottomRight">
      <div class="homeHeader_user">
        <Avatar
          alt="用户头像"
          class="homeHeader_avatar"
          shape="square"
          v-if="userInfo.headPic"
          :src="userInfo.headPicPath"
        ></Avatar>
        <Avatar alt="用户头像" class="homeHeader_avatar" shape="square" v-else>
          <template #icon><UserOutlined /></template>
        </Avatar>
        <span class="homeHeader_userName">{{ userInfo.username }}</span>
      </div>
      <template #overlay>
        <KeepAlive>
          <Menu :items="items"></Menu>
        </KeepAlive>
      </template>
    </Dropdown>
  </LayoutHeader>
</template>
<!-- 样式 -->
<style scoped>
#homeHeader_container {
  padding-inline: 0;
  @apply bg-white shadow-xl flex justify-between items-center px-6 leading-none select-none rounded;
}
.homeHeader_trigger {
  @apply cursor-pointer mr-6 text-lg leading-[1.125rem] transition-colors delay-300 hover:text-[#1976D2];
}
.homeHeader_user {
  @apply h-full flex items-center cursor-pointer px-3;
}
.homeHeader_user:hover {
  @apply bg-blue-400/10 rounded;
}
.homeHeader_avatar {
  @apply mr-3 flex justify-center items-center;
}
.homeHeader_userName {
  @apply text-slate-800 font-medium text-lg leading-[1.125rem] align-middle;
}
</style>
