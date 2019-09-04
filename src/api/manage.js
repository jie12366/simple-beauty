import { requestUrl } from '@/service/axios'

const manage = {
    // 获取用户照片集
    getPhotos (uid) {
        return requestUrl('get', `/photos/${uid}`)
    },
    deletePhoto (key, alt, uid) {
        return requestUrl('delete', `/photo/${key}/${alt}/${uid}`, {
            headers: { Accept: '/' }
        })
    }
}

export default manage
