// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import api from '@/api'
import ElementUI from 'element-ui' // 引入element-ui
import 'element-ui/lib/theme-chalk/index.css'
import { library } from '@fortawesome/fontawesome-svg-core' // 引入fortawesome
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import mavonEditor from 'mavon-editor' // 引入mavon-editor
import 'mavon-editor/dist/css/index.css'
import '@/assets/iconfont.css' // 引入iconfont
import './style/font.scss' // 引入自定义字体
import moment from 'moment' // 引入moment
import 'moment/locale/zh-cn'
import { setMetaTitle } from '@/utils/common'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'

Vue.use(Viewer)
Viewer.setDefaults({
  Options: { 'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source' }
})

library.add(fas)
library.add(fab)
library.add(far)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

// 将api挂在到vue的原型上
Vue.prototype.$api = api

Vue.use(ElementUI) // 使用element

Vue.use(mavonEditor) // 使用mavonEditor

// 全局使用moment
moment.locale('zh-cn')
Vue.prototype.$moment = moment

Vue.directive('title', {
  inserted (el, binding) {
    setMetaTitle(binding.value)
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
