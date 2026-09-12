import { createApp } from 'vue'
import './assets/reset.scss'
import './assets/globol.scss'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
