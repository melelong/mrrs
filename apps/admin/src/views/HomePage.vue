<script setup lang="ts">
import { User } from '@icon-park/vue-next'
import { RouterView } from 'vue-router'
</script>
<template>
  <div>
    <div class="index-container">
      <div class="header flex justify-between p-5 border-b-2 border-[#1976D2]">
        <h1 class="m-0 text-[#1976D2] text-3xl font-black">会议室预订系统(管理员)</h1>
        <User theme="outline" size="40" fill="#1976D2" />
      </div>
      <div class="body">
        <RouterView v-slot="{ Component }">
          <Transition>
            <KeepAlive :max="10">
              <component :is="Component"></component>
            </KeepAlive>
          </Transition>
        </RouterView>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'HomePage'
}
</script>
