import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex) // 显式调用vuex

const state = {
login: false // 是否登录
}

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
})
