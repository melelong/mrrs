import { useTokenStore } from '@/stores/useTokenStore'
import { defineComponent, onMounted } from 'vue'
export default defineComponent({
  name: 'HomePage',
  setup() {
    const tokenState = useTokenStore()
    onMounted(async () => {
      const userInfo = tokenState.getUserInfo
      const accessToken = tokenState.getAccessToken
      const refreshToken = tokenState.getRefreshToken
      console.log(userInfo)
      console.log(accessToken)
      console.log(refreshToken)
    })
    return () => <div>HomePage</div>
  }
})
