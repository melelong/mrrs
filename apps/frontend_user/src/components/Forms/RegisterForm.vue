<!-- 逻辑 -->
<script setup lang="ts">
import {
  useFormState,
  type AllRulePassConfig,
  useFormPass,
  useFormRules,
  type FormRulesConfig
} from '@/hooks/useForm'
import router from '@/router'
import type { RegisterUser } from '@/types'
import { userApi } from '@/uitls'
import { EditName, Mail, User, Lock, LockOne, Key } from '@icon-park/vue-next'
import { Form, Input, Button, message, type FormInstance } from 'ant-design-vue'
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
// 表单dom
const formDomRef = ref<FormInstance>()
// 表单状态
const registerFormState = useFormState<RegisterUser>({
  username: '',
  nickName: '',
  password: '',
  email: '',
  captcha: ''
})
// 确认密码
const confirmPwd = ref<string>('')
// 规则
// 所有的生成自定义规则函数的配置对象
const allRulePassConfig: AllRulePassConfig<string> = {
  username: [
    {
      isPass: (value) => value === '',
      message: '请输入用户名!'
    },
    {
      isPass: (value) => /\s/.test(value),
      message: '用户名不能有空格'
    },
    {
      isPass: (value) => !(value.length >= 2 && value.length <= 8),
      message: '用户名长度为2位到8位'
    }
  ],
  nickName: [
    {
      isPass: (value) => value === '',
      message: '请输入昵称!'
    },
    {
      isPass: (value) => /\s/.test(value),
      message: '昵称不能有空格'
    },
    {
      isPass: (value) => !(value.length >= 2 && value.length <= 8),
      message: '昵称长度为2位到8位'
    }
  ],
  password: [
    {
      isPass: (value) => value === '',
      message: '请输入密码!'
    },
    {
      isPass: (value) => /\s/.test(value),
      message: '密码不能有空格'
    },
    {
      isPass: (value) => !(value.length >= 8 && value.length <= 11),
      message: '密码长度为8位到11位'
    }
  ],
  confirmPwd: [
    {
      isPass: () => confirmPwd.value === '',
      message: '请确认密码!'
    },
    {
      isPass: () => /\s/.test(confirmPwd.value),
      message: '密码不能有空格'
    },
    {
      isPass: () => confirmPwd.value !== registerFormState.password,
      message: '两次密码不一致'
    }
  ],
  email: [
    {
      isPass: (value) => value === '',
      message: '请输入邮箱地址!'
    },
    {
      isPass: (value) => /\s/.test(value),
      message: '邮箱地址不能有空格'
    },
    {
      isPass: (value) => !/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value),
      message: '不是合法的邮箱地址'
    }
  ],
  captcha: [
    {
      isPass: (value) => value === '',
      message: '请输入验证码!'
    },
    {
      isPass: (value) => /\s/.test(value),
      message: '验证码不能有空格'
    },
    {
      isPass: (value) => value.length !== 6,
      message: '验证码长度为6位'
    }
  ]
}
// 所有生成表单规则的配置对象
const formRulesConfig: FormRulesConfig<string> = {
  username: {
    passFn: useFormPass<string>(allRulePassConfig.username),
    isRequired: true
  },
  nickName: {
    passFn: useFormPass<string>(allRulePassConfig.nickName),
    isRequired: true
  },
  password: {
    passFn: useFormPass<string>(allRulePassConfig.password),
    isRequired: true
  },
  confirmPwd: {
    passFn: useFormPass<string>(allRulePassConfig.confirmPwd),
    isRequired: true
  },
  email: {
    passFn: useFormPass<string>(allRulePassConfig.email),
    isRequired: true
  },
  captcha: {
    passFn: useFormPass<string>(allRulePassConfig.captcha),
    isRequired: true
  }
}
// 生成表单所有控件的校验规则
const rules = useFormRules<string>(formRulesConfig)
// 发送验证码按钮disabled状态
const isGetRegisterCaptcha = computed<boolean>(
  () =>
    !(
      registerFormState.username &&
      registerFormState.nickName &&
      registerFormState.password &&
      registerFormState.email &&
      registerFormState.captcha.length !== 6 &&
      confirmPwd.value
    )
)
// 发送验证码按钮loading状态
const isGetRegisterCaptchaLoading = ref<boolean>(false)
// 提交按钮disabled状态
const isDisabled = computed<boolean>(
  () =>
    !(
      registerFormState.username &&
      registerFormState.nickName &&
      registerFormState.password &&
      registerFormState.email &&
      registerFormState.captcha.length === 6 &&
      confirmPwd.value
    )
)
// 提交按钮loading状态
const isLoading = ref<boolean>(false)

// 事件处理函数
// 需要校验的表单控件名
const namePath = ['username', 'nickName', 'password', 'confirmPwd', 'email', 'captcha']
// 校验没有通过的表单控件名
let errorPath: any[]
// 校验表单
const handleSubmit = () => {
  if (isDisabled.value) return
  const formDom = formDomRef.value!
  formDom
    .validateFields(namePath)
    .catch(
      ({ errorFields }) => (errorPath = errorFields.map((item: { name: string }) => `${item.name}`))
    )
}
// 校验表单成功
const handleFinish = async () => {
  try {
    if (isLoading.value) return
    isLoading.value = true
    const { data } = await userApi.user.register(registerFormState)
    isLoading.value = false
    message.success(data)
    router.push('/login')
  } catch (err: any) {
    isLoading.value = false
    message.error(err.data || '系统繁忙，请稍后再试')
  }
}
// 校验表单不成功
const handleFinishFailed = () => {
  const formDom = formDomRef.value!
  message.error('表单验证没有通过！！！')
  if (errorPath.indexOf('password') !== -1 || errorPath.indexOf('confirmPwd') !== -1)
    confirmPwd.value = ''
  formDom.resetFields(errorPath)
}
// 发送验证码
const getRegisterCaptcha = async () => {
  try {
    registerFormState.captcha = ''
    if (isGetRegisterCaptchaLoading.value) return
    isGetRegisterCaptchaLoading.value = true
    if (isGetRegisterCaptcha.value) return
    const { data } = await userApi.email.registerCaptcha(registerFormState.email)
    isGetRegisterCaptchaLoading.value = false
    message.success(data)
  } catch (err: any) {
    const formDom = formDomRef.value!
    isGetRegisterCaptchaLoading.value = false
    message.error(err.data || '系统繁忙，请稍后再试')
    formDom.resetFields('email')
  }
}
</script>
<!-- 模板 -->
<template>
  <Form
    ref="formDomRef"
    @submit="handleSubmit"
    @finish="handleFinish"
    @finishFailed="handleFinishFailed"
    :model="registerFormState"
    :colon="false"
    :rules="rules"
  >
    <!-- 标题 -->
    <h1 class="text-[#1976D2] font-bold text-3xl mb-8 mt-4">注册</h1>

    <!-- 用户名 -->
    <Form.Item name="username">
      <Input
        placeholder="用户名"
        v-model:value="registerFormState.username"
        autocomplete="user_register_username"
      >
        <template #prefix>
          <User theme="outline" fill="#1976D2" />
        </template>
      </Input>
    </Form.Item>

    <!-- 昵称 -->
    <Form.Item name="nickName">
      <Input
        placeholder="昵称"
        v-model:value="registerFormState.nickName"
        autocomplete="user_register_nickName"
      >
        <template #prefix>
          <EditName theme="outline" fill="#1976D2" />
        </template>
      </Input>
    </Form.Item>

    <!-- 密码 -->
    <Form.Item name="password">
      <Input.Password
        placeholder="密码"
        v-model:value="registerFormState.password"
        autocomplete="user_register_password"
      >
        <template #prefix>
          <Lock theme="outline" fill="#1976D2" />
        </template>
      </Input.Password>
    </Form.Item>

    <!-- 确认密码 -->
    <Form.Item name="confirmPwd">
      <Input.Password
        placeholder="确认密码"
        v-model:value="confirmPwd"
        autocomplete="user_register_confirmPwd"
      >
        <template #prefix>
          <LockOne theme="outline" fill="#1976D2" />
        </template>
      </Input.Password>
    </Form.Item>

    <!-- 邮箱地址 -->
    <Form.Item name="email">
      <Input
        placeholder="邮箱地址"
        v-model:value="registerFormState.email"
        autocomplete="user_register_email"
      >
        <template #prefix>
          <Mail theme="outline" fill="#1976D2" />
        </template>
      </Input>
    </Form.Item>

    <!-- 验证码 -->
    <div class="w-full flex">
      <Form.Item name="captcha">
        <Input
          placeholder="验证码"
          v-model:value="registerFormState.captcha"
          autocomplete="user_register_captcha"
        >
          <template #prefix>
            <Key theme="outline" fill="#1976D2" />
          </template>
        </Input>
      </Form.Item>
      <Button
        class="ml-4"
        :disabled="isGetRegisterCaptcha"
        :loading="isGetRegisterCaptchaLoading"
        @click="getRegisterCaptcha"
        type="primary"
        >发送验证码</Button
      >
    </div>

    <!-- 跳转页面 -->
    <Form.Item>
      <div class="flex justify-end">
        <span>已有账号？</span>
        <RouterLink to="/login">去登录</RouterLink>
      </div>
    </Form.Item>

    <!-- 注册按钮 -->
    <Form.Item>
      <Button
        class="w-full"
        :disabled="isDisabled"
        :loading="isLoading"
        type="primary"
        htmlType="submit"
        >注册</Button
      >
    </Form.Item>
  </Form>
</template>
<!-- 组件名 -->
<script lang="ts">
export default {
  name: 'RegisterForm'
}
</script>
