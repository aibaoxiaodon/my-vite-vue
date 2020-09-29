import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import homeRouters from './homeRouters'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/home' },
  ...homeRouters
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router