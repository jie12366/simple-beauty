import axios from 'axios'
import store from '@/store/index'
import router from '@/router'
import baseURL from './base-url'

/**
 * 错误消息提示
 * msg 提示内容
 */
const tip = msg =>{
    this.$message({
        showClose: true,
        message: msg,
        type: error,
        center: true,
        duration: 1000
    })
}

/**
 * 跳转到登录页
 */
const toLogin = () =>{
    router.replace({
        path: '/login',
        // 携带当前页面路径为查询参数，登录成功后返回当前页
        query:{
            redirect: router.currentRouter.fullPath
        }
    });
}

const errorHandle = (status,msg) => {
    // 状态码判断
    switch(status) {
        // 未授权登录
        case 401:
            toLogin()
            break
        // token过期(清除token并跳转到登录)
        case 403:
            tip("登录过期,请重新登录")
            localStorage.removeItem('token')
            store.commit('login',null) // 把vuex中的token设置为null
            setTimeout(() => {
                toLogin()
            }, 1000);
            break
        // 资源不存在
        case 404:
            tip("请求的资源不存在")
            break
        default:
            console.log(msg)
    }
}

// 创建axios实例
var instance = axios.create({
    baseURL: baseURL, // 域名路径
    timeout: 1000 * 12 // 请求超时时间
})

// 设置post的请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

/**
 * 请求拦截器
 * 每次请求前判断是否存在token，如果存在token则在请求头携带token
 */
instance.interceptors.request.use(
    config => {
        const token = store.state.token
        if(token) {
            config.headers.Authorization = token
        }
        return config
    },
    error => Promise.error(error)
)

instance.interceptors.response.use(
    // 请求成功
    res => res.status === 200 ? Promise.resolve(res) : Promise.reject(res),
    // 请求失败
    error => {
        const {response} = error
        // 请求发送成功，但是响应错误
        if(response) {
            errorHandle(response.status,response.msg)
            return Promise.reject(response)
        }else {
            // 请求失败，说明断网了
            if(!window.navigator.onLine){
                store.commit('changeNetwork',false)
                return Promise.reject(error)
            }
        }
    }
)

//导出axios实例
export default instance;
