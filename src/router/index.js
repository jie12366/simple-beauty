import Vue from 'vue'
import Router from 'vue-router'
import App from '@/App'
import store from '@/store'

Vue.use(Router)

const home = r => require.ensure([], () => r(require('@page/home/home')), 'home')
const signIn = r => require.ensure([], () => r(require('@page/user/sign-in')), 'sign-in')
const signUp = r => require.ensure([], () => r(require('@page/user/sign-up')), 'sign-up')
const writer = r => require.ensure([], () => r(require('@page/articles/writer')), 'writer')

const router = new Router({
  routes: [
    {
      path: '/',
      component: App, // 顶级路由，对应index.html
      // 二级路由，对应App.vue
      children: [
        // 当路径为空时，默认跳转到home页面
        {
          path: '',
          redirect: '/home'
        },
        // 首页
        {
          path: '/home',
          component: home
        },
        // 登录页
        {
          path: '/sign-in',
          component: signIn
        },
        // 注册页
        {
          path: '/sign-up',
          component: signUp
        },
        // 写文章
        {
          path: '/writer',
          component: writer
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  let token = store.state.token
  if (to.meta.requiresAuth) {
    if (token) {
      next()
    } else {
      next({
        path: '/sign-in',
        query: {
          redirect: to.fullPath
        }
      })
    }
  } else {
    next()
  }
})

export default router
