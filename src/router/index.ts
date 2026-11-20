import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import type {RouteRecordRaw} from "vue-router"
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/index',
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    children:[
      {
        path: '/index',
        name: 'index',
        component: () => import('@/views/index/index.vue'),
      },
      {
        path: '/culture',
        name: 'culture',
        component: () => import('@/views/culture/index.vue'),
      },
      {
        path: '/innovation',
        name: 'innovation',
        component: () => import('@/views/innovation/index.vue'),
      }
    ]
  },
]
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  next();
})

export default router
