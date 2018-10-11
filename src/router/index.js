import Vue from 'vue'
import Router from 'vue-router'
import { getStorage } from '@/util'

Vue.use(Router)

// 版本管理
const versionsRoutes = {
  name: 'versions',
  path: '/versions',
  redirect: '/versions/list',
  component: resolve => require(['@/pages/versions/Index'], resolve),
  meta: { title: '版本管理' },
  children: [
    {
      name: 'versionsList',
      path: '/versions/list',
      component: resolve => require(['@/pages/versions/List'], resolve),
      meta: { title: '版本管理列表' }
    },
    {
      name: 'versionsAdd',
      path: '/versions/add',
      component: resolve => require(['@/pages/versions/Add'], resolve),
      meta: { title: '版本新建页' }
    },
    {
      name: 'versionsEdit',
      path: '/versions/edit',
      component: resolve => require(['@/pages/versions/Add'], resolve),
      meta: { title: '版本编辑页' },
      hidden: true
    }
  ]
}

// 权限设置 => 目前默认为版本管理
const redirect = '/versions/list'
const children = [
  versionsRoutes
]

// 登录
const loginRoutes = [
  {
    name: 'login',
    path: '/login',
    component: resolve => require(['@/pages/Login'], resolve),
    beforeEnter: (to, from, next) => {
      let username = getStorage('username')
      if (username) {
        next({ path: '/' })
      } else {
        next()
      }
    },
    hidden: true
  }
]

// 布局主体
const layoutRoutes = [
  {
    name: 'layout',
    path: '/',
    redirect: redirect,
    component: resolve => require(['@/pages/Layout'], resolve),
    beforeEnter: (to, from, next) => {
      let username = getStorage('username')
      if (username) {
        next()
      } else {
        next({ path: '/login' })
      }
    },
    children: children
  }
]

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    ...layoutRoutes,
    ...loginRoutes
  ]
})
