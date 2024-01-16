import { defineComponent, onMounted } from 'vue'
export default defineComponent({
  name: 'HomePage',
  setup() {
    onMounted(async () => {
      const canvas = document.createElement('canvas')
      console.table(canvas)
    })
    return () => <div>HomePage</div>
  }
})
