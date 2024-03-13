<!-- 组件名 -->
<script lang="ts">
export default {
  name: 'HomeLayout'
}
</script>
<!-- 逻辑 -->
<script setup lang="ts">
import { Layout, type ItemType } from 'ant-design-vue'
import { CalendarOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons-vue'
import HomeSider from './HomeSider.vue'
import HomeHeader from './HomeHeader.vue'
import HomeContent from './HomeContent.vue'
import { computed, h, ref } from 'vue'
import { EditTwo, Afferent } from '@icon-park/vue-next'
import { useTokenStore } from '@/stores/useTokenStore'
import { useAppStore } from '@/stores/useAppStore'
import { useRoute, useRouter } from 'vue-router'
const tokenStore = useTokenStore()
const appStore = useAppStore()
const router = useRouter()
const route = useRoute()
const SiderItems = ref([
  {
    key: 'home',
    icon: () => h(SettingOutlined),
    label: '首页',
    title: '',
    onClick: function () {
      if (route.name === 'home') return
      selectedKeys.value = ['home']
      router.push('/home')
    }
  },
  {
    key: 'meetingRoomList',
    icon: () => h(AppstoreOutlined),
    label: '会议室列表',
    title: '',
    onClick: function () {
      if (route.name === 'meetingRoomList') return
      selectedKeys.value = ['meetingRoomList']
      router.push('/meetingRoomList')
    }
  },
  {
    key: 'bookingHistory',
    icon: () => h(CalendarOutlined),
    label: '预订历史',
    title: '',
    onClick: function () {
      if (route.name === 'bookingHistory') return
      selectedKeys.value = ['bookingHistory']
      router.push('/bookingHistory')
    }
  }
])
const HeaderItmes = ref<ItemType[]>([
  {
    key: 'updateInfo',
    icon: () => h(EditTwo),
    label: '修改信息',
    onClick: function () {
      if (route.name === 'updateInfo') return
      appStore.setVisible(false)
      router.push('/user/update_info')
    }
  },
  {
    type: 'divider'
  },
  {
    key: 'logout',
    icon: () => h(Afferent),
    label: '登出',
    onClick: async function () {
      appStore.setVisible(false)
      tokenStore.LogOut()
    }
  }
])
const collapsed = computed(() => appStore.getCollapsed as boolean)
const visible = computed(() => appStore.getVisible as boolean)
const selectedKeys = ref<(string | number)[]>(['home'])
const handleShowSider = (e: boolean) => appStore.setCollapsed(e)
const handleShowMenu = (e: boolean) => appStore.setVisible(e)
</script>
<!-- 模板 -->
<template>
  <Layout class="homeLayout_container">
    <HomeSider
      title="会议预订系统"
      :collapsed="collapsed"
      :items="SiderItems"
      v-model:selectedKeys="selectedKeys"
      @showSider="handleShowSider"
    />
    <Layout>
      <HomeHeader
        :visible="visible"
        :collapsed="collapsed"
        @showSider="handleShowSider"
        @showMenu="handleShowMenu"
        :items="HeaderItmes"
      />
      <HomeContent />
    </Layout>
  </Layout>
</template>
<!-- 样式 -->
<style scoped>
.homeLayout_container {
  @apply w-screen h-screen overflow-hidden;
}
</style>
