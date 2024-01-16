import './assets/main.css'
import '@icon-park/vue-next/styles/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
createApp(App).use(createPinia()).use(router).mount('#app')
