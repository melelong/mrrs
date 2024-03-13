<!-- 逻辑 -->
<script setup lang="ts">
import FormLayout from '@/components/PageLayout/FormLayout/index.vue'
import LoginForm from '@/components/Forms/LoginForm.vue'
</script>
<!-- 模板 -->
<template>
  <FormLayout>
    <LoginForm />
  </FormLayout>
</template>
<!-- 组件名 -->
<script lang="ts">
export default {
  name: 'LoginPage'
}
</script>
