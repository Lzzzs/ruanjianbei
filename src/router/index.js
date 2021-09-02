import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/login/Login.vue'),
  },
  {
    path: '/admin',
    component: () => import('@/views/admin/Admin.vue'),
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/admin/main/DashBoard.vue'),
        children: [
          {
            path: ':dashboardName',
            component: () => import('@/components/dashboard/DashBoardContent.vue'),
          }
        ]
      },
      {
        path: 'dataSetout',
        component: () => import('@/views/admin/main/DataSetout.vue'),
      },
      {
        path: 'charts',
        component: () => import('@/views/admin/main/Charts.vue'),
        children: [
          {
            path: ':tableName',
            component: () => import('@/views/admin/main/Charts.vue'),
          },
        ]
      },
      {
        path: 'createChart',
        component: () => import('@/views/admin/main/CreateChart.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
