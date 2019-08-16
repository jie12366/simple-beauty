import Vue from 'vue'
import Router from 'vue-router'
import App from '@/App'

Vue.use(Router)

const signIn = r => require.ensure([], () => r(require('@page/user/sign-in')), 'sign-in')
const signUp = r => require.ensure([], () => r(require('@page/user/sign-up')), 'sign-up')

export default new Router({
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
        // 登录页
        {
          path: '/sign-in',
          component: signIn
        },
        // 注册页
        {
          path: '/sign-up',
          component: signUp
        }
      ]
    }
  ]
})
