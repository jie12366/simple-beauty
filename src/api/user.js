import { requestUrl } from '@/service/axios'

const user = {
    // 获取用户信息
    getUsersInfo (uid) {
        return requestUrl('get', `/users/${uid}`)
    },
    // 发送邮件验证码
    sendEmailCaptcha (email) {
        return requestUrl('post', '/emailCaptcha', {
            email
        })
    },
    // 检查邮件验证码是否正确或过期
    checkEmailCaptcha (code) {
        return requestUrl('post', '/captcha', {
            key: 'emailCaptcha',
            code
        })
    },
    // 绑定邮箱
    bindEmail (email, uid) {
        return requestUrl('put', '/email', {
            email,
            uid
        })
    },
    // 检查昵称是否存在
    checkNickName (nickname) {
        return requestUrl('post', '/nickname', {
            nickname
        })
    },
    updateInfo (nickname, introduction, uid) {
        return requestUrl('put', 'usersInfo', {
            nickname, introduction, uid
        })
    }
}

export default user
