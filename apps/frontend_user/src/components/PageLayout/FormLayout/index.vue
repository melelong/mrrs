<!-- 组件名 -->
<script lang="ts">
export default {
  name: 'FormLayout'
}
</script>
<!-- 模板 -->
<template>
  <div class="formLayout_container">
    <div class="form_container">
      <slot></slot>
    </div>
  </div>
</template>
<!-- 样式 -->
<style scoped>
.formLayout_container {
  @apply w-screen h-screen flex items-center justify-center flex-col select-none bg-bg bg-repeat p-3;
}
.form_container {
  @apply 2xl:w-[25%] xl:w-4/12 lg:w-5/12 md:w-6/12 sm:w-7/12 p-8 rounded-xl border shadow-2xl text-center bg-white;
}
</style>
