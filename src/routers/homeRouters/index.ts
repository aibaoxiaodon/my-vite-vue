const routersList = [
    { path: '/home', component: () => import('../../views/home/index.vue') },
    { path: '/amap', component: () => import('../../views/amap/index.vue') }
]

export default routersList