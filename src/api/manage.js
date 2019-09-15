import { requestUrl, requestJson } from '@/service/axios'

const manage = {
    // 获取用户照片集
    getPhotos (uid) {
        return requestUrl('get', `/photos/${uid}`)
    },
    // 删除照片
    deletePhoto (key, uid) {
        return requestUrl('delete', `/photo/${key}/${uid}`, {
            headers: { Accept: '/' }
        })
    },
    // 保存个人简介
    saveIntroduce (data) {
        return requestJson('post', '/introduction', {
            data
        })
    },
    // 更新个人简介
    updateIntroduce (data) {
        return requestJson('put', '/introduction', {
            data
        })
    },
    // 获取个人简介
    getIntroduce (uid) {
        return requestUrl('get', `/introduction/${uid}`)
    }
}

export default manage
