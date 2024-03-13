<!-- 
export default defineComponent({
  name: 'UpdatePasswordPage',
  setup() {
   

    return () => (
      
    )
  }
}) -->
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
import type { UpdateUserPassword } from '@/types'
import { adminApi } from '@/uitls'
import { Mail, User, Lock, LockOne, Key } from '@icon-park/vue-next'
import { Form, Input, Button, message, type FormInstance } from 'ant-design-vue'
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
// 表单dom
const formDomRef = ref<FormInstance>()
// 表单状态
const updateUserPasswordFormState: UpdateUserPassword = useFormState<UpdateUserPassword>({
  username: '',
  password: '',
  email: '',
  captcha: ''
})
// 确认密码
const confirmPwd = ref<string>('')
/**
 * 生成规则
 */
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
      isPass: () => confirmPwd.value !== updateUserPasswordFormState.password,
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
const isGetUpdateUserPasswordCaptcha = computed<boolean>(
  () =>
    !(
      updateUserPasswordFormState.username &&
      updateUserPasswordFormState.password &&
      updateUserPasswordFormState.email &&
      confirmPwd.value
    )
)
// 发送验证码按钮loading状态
const isGetUpdateUserPasswordCaptchaLoading = ref<boolean>(false)
// 提交按钮disabled状态
const isDisabled = computed<boolean>(
  () =>
    !(
      updateUserPasswordFormState.username &&
      updateUserPasswordFormState.password &&
      updateUserPasswordFormState.email &&
      updateUserPasswordFormState.captcha &&
      confirmPwd.value
    )
)
// 提交按钮loading状态
const isLoading = ref<boolean>(false)

// 事件处理函数
// 需要校验的表单控件名
const namePath = ['username', 'password', 'confirmPwd', 'email', 'captcha']
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
    const { data } = await adminApi.user.userUpdateUserPassword(updateUserPasswordFormState)
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
const getUpdateUserPasswordCaptcha = async () => {
  try {
    updateUserPasswordFormState.captcha = ''
    if (isGetUpdateUserPasswordCaptchaLoading.value) return
    isGetUpdateUserPasswordCaptchaLoading.value = true
    if (isGetUpdateUserPasswordCaptcha.value) return
    const { data } = await adminApi.email.updatePasswordCaptcha(updateUserPasswordFormState.email)
    isGetUpdateUserPasswordCaptchaLoading.value = false
    message.success(data)
  } catch (err: any) {
    const formDom = formDomRef.value!
    isGetUpdateUserPasswordCaptchaLoading.value = false
    message.error(err.data || '系统繁忙，请稍后再试')
    formDom.resetFields('email')
  }
}
</script>
<!-- 模板 -->
<template>
  <div
    class="updateUserPassword_container w-screen h-screen flex items-center justify-center flex-col text-center select-none bg-bg bg-repeat"
  >
    <div
      class="form_container 2xl:w-3/12 2xl:h-2/12 xl:w-4/12 xl:h-6/12 lg:w-5/12 lg:h-6/12 md:w-6/12 md:h-5/12 sm:w-7/12 sm:h-5/12 p-8 rounded-xl border shadow-2xl bg-white"
    >
      <Form
        ref="formDomRef"
        @submit="handleSubmit"
        @finish="handleFinish"
        @finishFailed="handleFinishFailed"
        :model="updateUserPasswordFormState"
        :colon="false"
        :rules="rules"
      >
        <!-- 标题 -->
        <h1 class="text-[#1976D2] font-bold text-3xl mb-8 mt-4">修改密码</h1>

        <!-- 用户名 -->
        <Form.Item name="username">
          <Input
            placeholder="用户名"
            v-model:value="updateUserPasswordFormState.username"
            autocomplete="user_login_username"
          >
            <template #prefix>
              <User theme="outline" fill="#1976D2" />
            </template>
          </Input>
        </Form.Item>

        <!-- 新密码 -->
        <Form.Item name="password">
          <Input.Password
            placeholder="新密码"
            v-model:value="updateUserPasswordFormState.password"
            autocomplete="user_updateUserPassword_password"
          >
            <template #prefix>
              <Lock theme="outline" fill="#1976D2" />
            </template>
          </Input.Password>
        </Form.Item>

        <!-- 确认密码 -->
        <Form.Item name="confirmPwd">
          <Input.Password
            placeholder="确认新密码"
            v-model:value="confirmPwd"
            autocomplete="user_updateUserPassword_confirmPwd"
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
            v-model:value="updateUserPasswordFormState.email"
            autocomplete="user_updateUserPassword_email"
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
              v-model:value="updateUserPasswordFormState.captcha"
              autocomplete="user_updateUserPassword_captcha"
            >
              <template #prefix>
                <Key theme="outline" fill="#1976D2" />
              </template>
            </Input>
          </Form.Item>
          <Button
            class="ml-4"
            :disabled="isGetUpdateUserPasswordCaptcha"
            :loading="isGetUpdateUserPasswordCaptchaLoading"
            @click="getUpdateUserPasswordCaptcha"
            type="primary"
          >
            发送验证码
          </Button>
        </div>

        <!-- 跳转页面 -->
        <Form.Item>
          <div class="flex justify-end">
            <span>记得密码了？</span>
            <RouterLink to="/login">去登录</RouterLink>
          </div>
        </Form.Item>

        <!-- 修改按钮 -->
        <Form.Item>
          <Button
            class="w-full"
            :disabled="isDisabled"
            :loading="isLoading"
            type="primary"
            htmlType="submit"
          >
            修改
          </Button>
        </Form.Item>
      </Form>
    </div>
  </div>
</template>
<!-- 组件名 -->
<script lang="ts">
export default {
  name: 'UpdatePasswordPage'
}
</script>
