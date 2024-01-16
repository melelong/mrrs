import { Form, Input, Button, Space, Image, message, type FormInstance } from 'ant-design-vue'
import { User, Lock, Key } from '@icon-park/vue-next'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { adminApi, svgToBase64 } from '@/uitls'
import {
  useFormState,
  useFormPass,
  type AllRulePassConfig,
  type FormRulesConfig,
  useFormRules
} from '@/hooks/useForm'
import type { LoginUser } from '@/types'
export default defineComponent({
  name: 'LoginPage',
  setup() {
    // 表单dom
    const formDomRef = ref<FormInstance>()
    // 表单状态
    const loginFormState = useFormState<LoginUser>({
      username: '',
      password: '',
      captcha: ''
    })
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
          isPass: (value) => value.length !== 4,
          message: '验证码长度为4位'
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
      captcha: {
        passFn: useFormPass<string>(allRulePassConfig.captcha),
        isRequired: true
      }
    }
    // 生成表单所有控件的校验规则
    const rules = useFormRules<string>(formRulesConfig)
    // 提交按钮disabled状态
    const isDisabled = computed<boolean>(
      () => !(loginFormState.username && loginFormState.password && loginFormState.captcha)
    )
    // 提交按钮loading状态
    const isLoading = ref<boolean>(false)
    // 事件处理函数
    // 需要校验的表单控件名
    const namePath = ['username', 'password', 'captcha']
    // 校验没有通过的表单控件名
    let errorPath: any[]
    // 校验表单
    const handleSubmit = () => {
      const formDom = formDomRef.value!
      formDom
        .validateFields(namePath)
        .catch(
          ({ errorFields }) =>
            (errorPath = errorFields.map((item: { name: string }) => `${item.name}`))
        )
    }
    // 校验表单成功
    const handleFinish = async () => {
      try {
        if (isLoading.value) return
        isLoading.value = true
        const data = await adminApi.user.userLogin(loginFormState)
        isLoading.value = false
        message.success('登录成功')
        console.log(data)
      } catch (err: any) {
        isLoading.value = false
        message.error(err.data || '系统繁忙，请稍后再试')
        await getUserLoginCaptcha()
      }
    }
    // 校验表单不成功
    const handleFinishFailed = () => {
      const formDom = formDomRef.value!
      message.error('表单验证没有通过！！！')
      formDom.resetFields(errorPath)
    }
    // 获取验证码
    const imgSrcRef = ref<string>('')
    const getUserLoginCaptcha = async () => {
      const { data } = await adminApi.user.userLoginCaptcha()
      imgSrcRef.value = svgToBase64(data)
    }
    onMounted(async () => {
      await getUserLoginCaptcha()
    })

    return () => (
      <div class="login_container w-screen h-screen flex items-center justify-center flex-col text-center select-none bg-bg bg-repeat">
        <div class="form_container 2xl:w-3/12 2xl:h-2/12 xl:w-4/12 xl:h-6/12 lg:w-5/12 lg:h-6/12 md:w-6/12 md:h-5/12 sm:w-7/12 sm:h-5/12 p-8 rounded-xl border shadow-2xl bg-white">
          <Form
            ref={formDomRef}
            onSubmit={handleSubmit}
            onFinish={handleFinish}
            onFinishFailed={handleFinishFailed}
            model={loginFormState}
            colon={false}
            rules={rules}
          >
            {/* 标题 */}
            <h1 class="text-[#1976D2] font-bold text-3xl mb-8 mt-4">会议室预订系统 登录</h1>

            {/* 用户名 */}
            <Form.Item name="username">
              <Input
                placeholder="用户名"
                v-model={[loginFormState.username, 'value']}
                prefix={<User theme="outline" fill="#1976D2" />}
                autocomplete="user_login_username"
              />
            </Form.Item>

            {/* 密码 */}
            <Form.Item name="password">
              <Input.Password
                placeholder="密码"
                v-model={[loginFormState.password, 'value']}
                prefix={<Lock theme="outline" fill="#1976D2" />}
                autocomplete="user_login_password"
              />
            </Form.Item>

            {/* 验证码 */}
            <div class="w-full flex">
              <Space direction="horizontal">
                <Form.Item name="captcha">
                  <Input
                    placeholder="验证码"
                    v-model={[loginFormState.captcha, 'value']}
                    prefix={<Key theme="outline" fill="#1976D2" />}
                    autocomplete="user_login_captcha"
                  />
                </Form.Item>
                <span onClick={getUserLoginCaptcha}>
                  <Image
                    class="rounded-md border overflow-hidden"
                    src={imgSrcRef.value}
                    preview={false}
                  ></Image>
                </span>
              </Space>
            </div>

            {/* 跳转页面 */}
            <Form.Item>
              <div class="flex justify-between">
                <RouterLink to="/register" class="text-[#1976D2]">
                  创建账号
                </RouterLink>
                <RouterLink to="/update_password" class="text-[#1976D2]">
                  忘记密码
                </RouterLink>
              </div>
            </Form.Item>

            {/* 登录按钮 */}
            <Form.Item>
              <Button
                class="w-full"
                disabled={isDisabled.value}
                loading={isLoading.value}
                type="primary"
                htmlType="submit"
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
})
