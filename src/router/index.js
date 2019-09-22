import Vue from 'vue'
import Router from 'vue-router'
import App from '@/App'
import api from '@/api'

Vue.use(Router)

const home = r => require.ensure([], () => r(require('@page/home/home')), 'home')
const message = r => require.ensure([], () => r(require('@page/message/index')), 'message')
const like = r => require.ensure([], () => r(require('@page/message/like')), 'like')
const comment = r => require.ensure([], () => r(require('@page/message/comment')), 'comment')
const signIn = r => require.ensure([], () => r(require('@page/login/sign-in')), 'sign-in')
const signUp = r => require.ensure([], () => r(require('@page/login/sign-up')), 'sign-up')
const forget = r => require.ensure([], () => r(require('@page/login/forget')), 'forget')
const writer = r => require.ensure([], () => r(require('@page/articles/writer')), 'writer')
const articles = r => require.ensure([], () => r(require('@page/articles/details')), 'articles')
const articlesPwd = r => require.ensure([], () => r(require('@page/articles/decrypt')), 'articlesPwd')
const mine = r => require.ensure([], () => r(require('@page/mine/mine')), 'mine')
const index = r => require.ensure([], () => r(require('@page/mine/index')), 'index')
const tags = r => require.ensure([], () => r(require('@page/mine/tags')), 'tags')
const tagNotes = r => require.ensure([], () => r(require('@page/mine/tag-notes')), 'tagNotes')
const categorys = r => require.ensure([], () => r(require('@page/mine/categorys')), 'categorys')
const categoryNotes = r => require.ensure([], () => r(require('@page/mine/category-notes')), 'categoryNotes')
const archives = r => require.ensure([], () => r(require('@page/mine/archives')), 'archives')
const archiveNotes = r => require.ensure([], () => r(require('@page/mine/archive-notes')), 'archiveNotes')
const photosWall = r => require.ensure([], () => r(require('@page/mine/photos-wall')), 'photosWall')
const about = r => require.ensure([], () => r(require('@page/mine/about')), 'about')
const information = r => require.ensure([], () => r(require('@page/mine/information')), 'information')
const manage = r => require.ensure([], () => r(require('@page/manage/index')), 'manage')
const articlesList = r => require.ensure([], () => r(require('@page/manage/articles')), 'articlesList')
const photos = r => require.ensure([], () => r(require('@page/manage/photos')), 'photos')
const aboutMe = r => require.ensure([], () => r(require('@page/manage/about-me')), 'aboutMe')

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
        }, // 消息页
        {
          path: 'message',
          component: message,
          children: [
            {
              path: 'like',
              component: like,
              meta: {
                title: '点赞列表',
                requiresAuth: true
              }
            },
            {
              path: 'comment',
              component: comment,
              meta: {
                title: '评论列表',
                requiresAuth: true
              }
            }
          ]
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
        // 注册页
        {
          path: '/forget',
          component: forget,
          meta: {
            title: '忘记密码'
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
        }, {
          path: '/articlesPwd',
          name: 'articlesPwd',
          component: articlesPwd
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
            }, { // 分类
              path: ':uid/categorys',
              component: categorys
            }, { // 分类对应的文章
              path: ':uid/category/:category',
              component: categoryNotes
            }, { // 归档
              path: ':uid/archives',
              component: archives
            }, { // 归档对应的文章
              path: ':uid/archive/:archive',
              component: archiveNotes
            }, { // 照片墙
              path: ':uid/photos-wall',
              component: photosWall
            }, { // 关于我
              path: ':uid/about',
              component: about
            }, {
              path: 'information',
              component: information,
              meta: {
                title: '个人资料',
                requiresAuth: true
              }
            }
          ]
        },
        {
          path: '/manage',
          component: manage,
          children: [
            { // 管理博客
              path: 'articles-list',
              component: articlesList,
              meta: {
                title: '文章管理',
                requiresAuth: true
              }
            },
            { // 管理照片墙
              path: 'photos',
              component: photos,
              meta: {
                title: '照片管理',
                requiresAuth: true
              }
            }, { // 个人简介管理
              path: 'about-me',
              component: aboutMe,
              meta: {
                title: '个人简介管理',
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
