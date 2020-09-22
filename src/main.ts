import { createApp } from 'vue'
import App from './App.vue'
import routers from './routers/index'
import './index.css'

const app = createApp(App)

app.use(routers)
app.mount('#app')
