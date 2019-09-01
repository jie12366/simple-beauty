import Vue from 'vue'
import Router from 'vue-router'
import App from '@/App'
import api from '@/api'

Vue.use(Router)

const home = r => require.ensure([], () => r(require('@page/home/home')), 'home')
const signIn = r => require.ensure([], () => r(require('@page/login/sign-in')), 'sign-in')
const signUp = r => require.ensure([], () => r(require('@page/login/sign-up')), 'sign-up')
const writer = r => require.ensure([], () => r(require('@page/articles/writer')), 'writer')
const articles = r => require.ensure([], () => r(require('@page/articles/details')), 'articles')
const mine = r => require.ensure([], () => r(require('@page/mine/mine')), 'mine')
const index = r => require.ensure([], () => r(require('@page/mine/index')), 'index')
const tags = r => require.ensure([], () => r(require('@page/mine/tags')), 'tags')
const tagNotes = r => require.ensure([], () => r(require('@page/mine/tag-notes')), 'tagNotes')
const information = r => require.ensure([], () => r(require('@page/mine/information')), 'information')

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
          component: home,
          meta: {
            title: '首页'
          }
        },
        // 登录页
        {
          path: '/sign-in',
          component: signIn,
          meta: {
            title: '登录'
          }
        },
        // 注册页
        {
          path: '/sign-up',
          component: signUp,
          meta: {
            title: '注册'
          }
        },
        // 写文章
        {
          path: '/writer',
          component: writer,
          meta: {
            title: '写文章',
            requiresAuth: true
          }
        },
        // 文章详情页
        {
          path: '/users/:uid/articles/:aid',
          component: articles,
          props: true
        },
        {
          path: '/:account',
          component: mine,
          props: true,
          children: [
            { // 主页
              path: ':uid/index',
              component: index
            }, { // 标签墙
              path: ':uid/tags',
              component: tags
            }, { // 标签对应的文章
              path: ':uid/tag/:tag',
              component: tagNotes
            }, {
              path: 'information',
              component: information,
              meta: {
                title: '个人资料',
                requiresAuth: true
              }
            }
          ]
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    api.login.getToken()
    next()
  } else {
    next()
  }
  if (to.meta.title) {
    document.title = to.meta.title
  } else {
    next()
  }
})

export default router
