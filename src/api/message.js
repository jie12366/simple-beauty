import { requestUrl } from '@/service/axios'

const message = {
    // 文章点赞
    likeArticle (uid, aid) {
        return requestUrl('post', `/article/like/${aid}/${uid}`)
    },
    // 判断用户是否点赞了文章
    isLike (uid, aid) {
        return requestUrl('get', `/article/like/${aid}/${uid}`)
    },
    // 获取消息未读数
    getNoReads (uid) {
        return requestUrl('get', `/message/${uid}`)
    },
    // 获取某类型消息未读数
    getNoReadsByType (type, uid) {
        return requestUrl('get', `/message/${type}/${uid}`)
    },
    // 获取消息列表
    getMessageList (uid, type, index, size) {
        return requestUrl('get', `/message/${uid}/${type}/${index}/${size}`)
    },
    // 改变未读消息状态
    changeState (id, uid) {
        return requestUrl('put', `/message/${id}/${uid}`)
    },
    // 删除消息
    deleteMessage (id) {
        return requestUrl('delete', `/message/${id}`)
    }
}
export default message
