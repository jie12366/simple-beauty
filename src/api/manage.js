import { requestUrl } from '@/service/axios'

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
    }
}

export default manage
