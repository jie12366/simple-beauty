import { requestUrl } from '@/service/axios'

const comments = {
    // 保存评论
    saveComment (aid, uid, content) {
        return requestUrl('post', 'comments', {
            aid,
            uid,
            content
        })
    },
    // 保存回复评论
    saveReplyComment (aid, uid, rUid, content, rContent) {
        return requestUrl('post', 'replyComments', {
            aid,
            uid,
            rUid,
            content,
            rContent
        })
    },
    // 分页获取评论列表
    getComments (aid, index, size) {
        return requestUrl('get', `comments/${aid}/${index}/${size}`)
    }
}

export default comments
