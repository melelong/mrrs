<!-- 逻辑 -->
<script setup lang="ts">
import FormLayout from '@/components/PageLayout/FormLayout/index.vue'
import RegisterForm from '@/components/Forms/RegisterForm.vue'
</script>
<!-- 模板 -->
<template>
  <FormLayout>
    <RegisterForm />
  </FormLayout>
</template>
<!-- 组件名 -->
<script lang="ts">
export default {
  name: 'RegisterPage'
}
</script>
