import axios from '@/service/http'
import { requestUrl, requestJson } from '@/service/axios'

const login = {
    // 获取图片验证码
    getCaptcha () {
        return axios.get('/imageCaptcha', {
            responseType: 'arraybuffer' // 服务器响应的数据类型
        }).then(response => {
            // 将二进制流的图片转码为base64(使用Uint8Array来读取arraybuffer)
            return ('data:image/png;base64,' + btoa(
                new Uint8Array(response.data)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
            ))
        })
    },
    // 检查图片验证码是否正确或过期
    checkImageCaptcha (code) {
        return requestUrl('post', '/captcha', {
            key: 'imageCaptcha',
            code
        })
    },
    // 登录
    signIn (data) {
        return requestJson('post', '/login', {
            data
        })
    },
    // 注销
    logout (account) {
        return requestUrl('delete', '/logout', {
            account
        })
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
    }
}
export default login
