import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { loadContent } from './data/content'

loadContent()
createApp(App).use(router).mount('#app')
