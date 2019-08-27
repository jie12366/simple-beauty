import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex) // 显式调用vuex

const state = {
    token: null, // 登录令牌,存在localStorage中，防止刷新页面丢失数据
    imgUrl: require('@/images/head-boy.png'), // 用户头像
    uid: 0 // 用户id
}

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
    plugins: [createPersistedState()]
})
