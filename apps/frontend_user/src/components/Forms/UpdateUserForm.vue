<!-- 组件名 -->
<script lang="ts">
export default {
  name: 'UpdateUserForm'
}
</script>
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
import { useTokenStore } from '@/stores/useTokenStore'
import { userApi } from '@/uitls'
import { UserOutlined } from '@ant-design/icons-vue'
import { Mail, User, Key } from '@icon-park/vue-next'
import {
  Form,
  Input,
  Avatar,
  Button,
  Upload,
  message,
  type FormInstance,
  type UploadChangeParam,
  type UploadFile
} from 'ant-design-vue'
import { computed, onMounted, ref } from 'vue'
const VITE_API_URL = import.meta.env.VITE_API_URL
// 表单dom
const formDomRef = ref<FormInstance>()
// 表单状态
const updateUserFormState: UpdateUser = useFormState<UpdateUser>({
  headPic: '',
  nickName: '',
  email: '',
  captcha: ''
})
const headPicPath = computed(() => `${VITE_API_URL}${updateUserFormState.headPic}`)
const actionPath = computed(() => `${VITE_API_URL}/api/upload/headPic`)
/**
 * 生成规则
 */
// 所有的生成自定义规则函数的配置对象
const allRulePassConfig: AllRulePassConfig<string> = {
  headPic: [
    {
      isPass: (value) => /\s/.test(value),
      message: '头像不能有空格'
    }
  ],
  nickName: [
    {
      isPass: (value) => /\s/.test(value),
      message: '昵称不能有空格'
    },
    {
      isPass: (value) => !(value.length >= 2 && value.length <= 8),
      message: '用户名长度为2位到8位'
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
  headPic: {
    passFn: useFormPass<string>(allRulePassConfig.headPic),
    isRequired: true
  },
  nickName: {
    passFn: useFormPass<string>(allRulePassConfig.nickName),
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
const isGetUpdateUserCaptcha = computed<boolean>(
  () => !(updateUserFormState.email && updateUserFormState.captcha.length !== 6)
)
// 发送验证码按钮loading状态
const isGetUpdateUserCaptchaLoading = ref<boolean>(false)
// 提交按钮disabled状态
const isDisabled = computed<boolean>(
  () => !(updateUserFormState.email && updateUserFormState.captcha.length === 6)
)
// 提交按钮loading状态
const isLoading = ref<boolean>(false)

// 事件处理函数
// 需要校验的表单控件名
const namePath = ['headPic', 'nickName', 'email', 'captcha']
// 校验没有通过的表单控件名
let errorPath: any[]
// 回显
const tokenStore = useTokenStore()
const dataEcho = async () => {
  try {
    const { data } = await userApi.user.info()
    tokenStore.setUserInfo(data)
    const { headPic, nickName, email } = tokenStore.getUserInfo
    updateUserFormState.headPic = headPic || ''
    updateUserFormState.nickName = nickName || ''
    updateUserFormState.email = email || ''
  } catch (err: any) {
    message.error(err.data || '系统繁忙，请稍后再试')
  }
}
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
    const { data } = await userApi.user.userUpdate(updateUserFormState)
    isLoading.value = false
    message.success(data)
    await dataEcho()
    router.push({ name: 'home' })
  } catch (err: any) {
    isLoading.value = false
    message.error(err.data || '系统繁忙，请稍后再试')
  }
}
// 校验表单不成功
const handleFinishFailed = () => {
  const formDom = formDomRef.value!
  message.error('表单验证没有通过！！！')
  formDom.resetFields(errorPath)
}
// 发送验证码
const getUpdateUserCaptcha = async () => {
  try {
    updateUserFormState.captcha = ''
    if (isGetUpdateUserCaptchaLoading.value) return
    isGetUpdateUserCaptchaLoading.value = true
    if (isGetUpdateUserCaptcha.value) return
    const { data } = await userApi.email.updateUserCaptcha(updateUserFormState.email)
    isGetUpdateUserCaptchaLoading.value = false
    message.success(data)
  } catch (err: any) {
    const formDom = formDomRef.value!
    isGetUpdateUserCaptchaLoading.value = false
    message.error(err.data || '系统繁忙，请稍后再试')
    formDom.resetFields('email')
  }
}
/**
 * 头像回显处理
 * @param info 文件信息
 */
const handleChange = async (info: UploadChangeParam<UploadFile<any>>) => {
  const { status } = info.file
  if (status === 'done') {
    const { accessPath } = info.file.response.data
    updateUserFormState.headPic = accessPath
    message.success(`${info.file.name} 文件上传成功`)
  } else if (status === 'error') {
    message.error(`${info.file.name} 文件上传失败`)
  }
}
onMounted(async () => {
  await dataEcho()
})
</script>
<!-- 模板 -->
<template>
  <div class="flex items-center justify-center w-full h-full">
    <div class="form_container">
      <Form
        ref="formDomRef"
        @submit="handleSubmit"
        @finish="handleFinish"
        @finishFailed="handleFinishFailed"
        :model="updateUserFormState"
        :colon="false"
        :rules="rules"
      >
        <!-- 标题 -->
        <h1 class="text-[#1976D2] font-bold text-3xl mb-8">修改信息</h1>

        <!-- 头像 -->
        <Form.Item name="headPic" class="headPic_container">
          <Upload
            :maxCount="1"
            withCredentials
            :showUploadList="false"
            :action="actionPath"
            accept="image/png, image/jpg, image/jpeg, image/gif"
            @reject="() => message.error('文件格式不符合')"
            @change="handleChange"
            name="headPic"
          >
            <Avatar
              alt="用户头像"
              shape="square"
              class="upload_dragger_avatar"
              v-if="updateUserFormState.headPic"
              :src="headPicPath"
            ></Avatar>
            <Avatar alt="用户头像" shape="square" class="upload_dragger_avatar" v-else>
              <template #icon><UserOutlined /></template>
            </Avatar>
          </Upload>
          <div class="a">
            <p class="text-[#1976D2] font-bold text-3xl mb-4">上传头像</p>
            <p class="text-gray-400">格式：支持PNG、JPG、JPEG、GIF</p>
            <p class="text-gray-400">大小：5M以内</p>
          </div>
        </Form.Item>

        <!-- 昵称 -->
        <Form.Item name="nickName">
          <Input
            placeholder="昵称"
            v-model:value="updateUserFormState.nickName"
            autocomplete="update_user_nickName"
          >
            <template #prefix>
              <User theme="outline" fill="#1976D2" />
            </template>
          </Input>
        </Form.Item>

        <!-- 邮箱地址 -->
        <Form.Item name="email">
          <Input
            placeholder="邮箱地址"
            v-model:value="updateUserFormState.email"
            autocomplete="update_user_email"
            disabled
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
              v-model:value="updateUserFormState.captcha"
              autocomplete="update_user_captcha"
            >
              <template #prefix>
                <Key theme="outline" fill="#1976D2" />
              </template>
            </Input>
          </Form.Item>
          <Button
            class="ml-4"
            :disabled="isGetUpdateUserCaptcha"
            :loading="isGetUpdateUserCaptchaLoading"
            @click="getUpdateUserCaptcha"
            type="primary"
          >
            发送验证码
          </Button>
        </div>

        <!-- 修改按钮 -->
        <Form.Item>
          <Button
            class="w-full"
            :disabled="isDisabled"
            :loading="isLoading"
            type="primary"
            htmlType="submit"
          >
            修改信息
          </Button>
        </Form.Item>
      </Form>
    </div>
  </div>
</template>
<style scoped>
.headPic_container p {
  @apply text-xs;
}
.upload_dragger_avatar {
  font-size: 3rem;
  @apply w-24 h-24 flex justify-center items-center;
}
.form_container {
  @apply 2xl:w-4/12 xl:w-5/12 lg:w-6/12 md:w-7/12 sm:w-8/12 p-8 rounded-xl border shadow-2xl text-center bg-white;
}
</style>
