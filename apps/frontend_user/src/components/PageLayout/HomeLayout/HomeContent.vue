<!-- 组件名 -->
<script lang="ts">
export default {
  name: 'HomeContent'
}
</script>
<!-- 逻辑 -->
<script setup lang="ts">
import { LayoutContent } from 'ant-design-vue'
import { RouterView } from 'vue-router'
import { defineProps } from 'vue'
/**
 * 组件属性
 */
type HomeContentProps = {
  cacheList?: any[]
}
const props = defineProps<HomeContentProps>()
</script>
<!-- 模板 -->
<template>
  <LayoutContent class="homeContent_container">
    <RouterView v-slot="{ Component }" class="homeContent_content">
      <Transition name="move" mode="out-in">
        <!-- <KeepAlive :include="props.cacheList"> -->
        <component :is="Component"></component>
        <!-- </KeepAlive> -->
      </Transition>
    </RouterView>
  </LayoutContent>
</template>
<!-- 样式 -->
<style scoped>
.homeContent_container {
  @apply p-2;
}
.homeContent_content {
  @apply bg-white shadow-xl rounded h-full w-full;
}
</style>
