import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './styles/app.css'
import { useTopicsStore } from './stores/topics.js'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

useTopicsStore().init()

app.mount('#app')
