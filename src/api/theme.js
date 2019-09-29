import { requestUrl } from '@/service/axios'

const theme = {
    // 获取用户主题
    getTheme (uid) {
        return requestUrl('get', `/theme/${uid}`)
    },
    // 更改代码样式
    updateStyle (style, uid) {
        return requestUrl('put', '/codeStyle', {
            style, uid
        })
    },
    // 还原设置
    revert (uid) {
        return requestUrl('delete', `/setting/${uid}`)
    }
}
export default theme
