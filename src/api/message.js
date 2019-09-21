import { requestUrl } from '@/service/axios'

const message = {
    // 文章点赞
    likeArticle (uid, aid) {
        return requestUrl('post', `/article/${aid}/${uid}`)
    },
    // 判断用户是否点赞了文章
    isLike (uid, aid) {
        return requestUrl('get', `/article/like/${aid}/${uid}`)
    },
    // 获取消息未读数
    getNoReads (uid) {
        return requestUrl('get', `/message/${uid}`)
    },
    // 获取点赞列表
    getLikeList (uid, index, size) {
        return requestUrl('get', `/message/${uid}/${index}/${size}`)
    },
    // 改变未读消息状态
    changeState (uid, aid, type) {
        return requestUrl('put', `/message/${aid}/${uid}/${type}`)
    }
}
export default message
