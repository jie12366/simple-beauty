import axios from 'axios'
import store from '@/store/index'
import router from '@/router'
import baseURL from './base-url'

// 创建axios实例
const instance = axios.create({
    baseURL: baseURL, // 域名路径
    timeout: 1000 * 12 // 请求超时时间
})

// 设置post的请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// 设置axios为异步请求
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

/**
 * 请求拦截器
 * 每次请求前判断是否存在token，如果存在token则在请求头携带token
 */
instance.interceptors.request.use(
    config => {
        const token = store.state.token
        if (token) {
            config.headers.Authorization = token
        }
        return config
    },
    error => Promise.error(error)
)

instance.interceptors.response.use(
    response => {
        return Promise.resolve(response)
    },
    error => {
        console.log(error.response)
        // 状态码判断
        console.log(error.response.status)
            // 未授权登录
            if (error.response.status === 401) {
                router.replace({
                    path: '/sign-in',
                    // 携带当前页面路径为查询参数，登录成功后返回当前页
                    query: {
                        redirect: router.currentRoute.fullPath
                    }
                }) // token过期(清除token并跳转到登录)
            } else if (error.response.status === 403) {
                localStorage.removeItem('token')
                store.commit('token', null) // 把vuex中的token设置为null
                setTimeout(() => {
                    router.replace({
                        path: '/sign-in',
                        // 携带当前页面路径为查询参数，登录成功后返回当前页
                        query: {
                            redirect: router.currentRoute.fullPath
                        }
                    })
                }, 1000) // 资源不存在
            } else {
                console.log('请求错误')
            }
        return Promise.reject(error.response)
    }
)

export default instance
