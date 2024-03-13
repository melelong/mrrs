<!-- 组件名 -->
<script lang="ts">
export default {
  name: 'UserPage'
}
</script>
<!-- 逻辑 -->
<script setup lang="ts">
import UpdateUserForm from '@/components/Forms/UpdateUserForm.vue'
</script>
<!-- 模板 -->
<template>
  <div class="UserPage_container">
    <UpdateUserForm />
  </div>
</template>
<!-- 样式 -->
<style scoped>
.UserPage_container {
  @apply text-center p-4;
}
</style>
