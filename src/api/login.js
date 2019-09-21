import { requestUrl, requestJson } from '@/service/axios'

const login = {
    // 登录
    signIn (data, remeberMe) {
        return requestJson('post', `/login?remeberMe=${remeberMe}`, {
            data
        })
    },
    // 注销
    logout (account) {
        return requestUrl('delete', `/logout/${account}`)
    },
    // 检查账号是否存在
    checkAccount (account) {
        return requestUrl('post', '/account', {
            account
        })
    },
    // 发送短信验证码
    sendSmsCaptcha (phone) {
        return requestUrl('post', '/phone', {
            phone
        })
    },
    // 检查短信验证码是否正确或过期
    checkSmsCaptcha (code) {
        return requestUrl('post', '/captcha', {
            key: 'smsCaptcha',
            code
        })
    },
    // 注册
    signUp (data) {
        return requestJson('post', '/register', {
            data
        })
    },
    getToken () {
        return requestUrl('get', '/token')
    }
}
export default login
