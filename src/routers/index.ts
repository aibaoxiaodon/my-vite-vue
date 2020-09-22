import { createApp } from 'vue'
import { createWebHashHistory, createRouter } from 'vue-router'

const history = createWebHashHistory()
const router = createRouter({
  history,
  routes: [
    { path: '/', component: () => import('../views/home/index.vue') }
  ]
})

export default router