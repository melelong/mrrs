<!-- 逻辑 -->
<script setup lang="ts">
import LoginLayout from '@/components/PageLayout/FormLayout/index.vue'
import UpdatePasswordForm from '@/components/Forms/UpdatePasswordForm.vue'
</script>
<!-- 模板 -->
<template>
  <LoginLayout>
    <UpdatePasswordForm />
  </LoginLayout>
</template>
<!-- 组件名 -->
<script lang="ts">
export default {
  name: 'UpdatePasswordPage'
}
</script>
