import axios from '@/service/http'
import { requestUrl } from '@/service/axios'

const articles = {
    // 上传图片
    uploadImage (image) {
        let formdata = new FormData()
        formdata.append('image', image)
        return new Promise((resolve, reject) => {
            axios['post']('/image', formdata, {headers: {'Content-Type': 'multipart/form-data'}})
            .then(res => {
                resolve(res.data)
            }, error => {
                reject(error.data)
            })
        }).catch(function (reason) {
            return reason.data
        })
    },
    // 存入文章
    saveArticles (data) {
        return requestUrl('post', '/articles', {
            'title': data.title,
            'contentMd': data.contentMd,
            'contentHtml': data.contentHtml,
            'tags': JSON.stringify(data.tags),
            'category': data.category,
            'uid': data.uid
        })
    },
    // 分页获取文章列表
    getArticles (index, size) {
        return requestUrl('get', `/articles/${index}/${size}`)
    },
    // 获取所有个人分类
    getCategorys (uid) {
        return requestUrl('get', `/categorys/${uid}`)
    }
}
export default articles
