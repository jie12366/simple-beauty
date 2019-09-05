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
            'pwd': data.pwd,
            'uid': data.uid,
            'aid': data.aid
        })
    },
    // 删除文章
    deleteArticle (aid, uid) {
        return requestUrl('delete', `/articles/${aid}/${uid}`)
    },
    // 分页获取文章列表
    getArticles (index, size) {
        return requestUrl('get', `/articles/${index}/${size}`)
    },
    // 分页获取我的文章列表
    getArticlesByUid (uid, index, size) {
        return requestUrl('get', `/articles/${uid}/${index}/${size}`)
    },
    // 获取所有个人分类
    getCategorys (uid) {
        return requestUrl('get', `/categorys/${uid}`)
    },
    // 获取文章内容
    getArticleByAid (aid) {
        return requestUrl('get', `/articleDetail/${aid}`)
    },
    // 获取文章数据
    getArticle (aid) {
        return requestUrl('get', `/article/${aid}`)
    },
    // 获取用户的所有标签
    getTags (uid) {
        return requestUrl('get', `/tags/${uid}`)
    },
    // 根据我得标签分页获取文章
    getArticlesByTag (uid, tag, index, size) {
        return requestUrl('get', `/articles/${uid}/tag/${tag}/${index}/${size}`)
    },
    // 根据我的分类分页获取文章
    getArticlesByCategory (uid, category, index, size) {
        return requestUrl('get', `/articles/${uid}/category/${category}/${index}/${size}`)
    }, // 获取用户的所有归档
    getArchives (uid) {
        return requestUrl('get', `/archives/${uid}`)
    },
    // 根据归档分页获取文章
    getArticlesByArchive (uid, archive, index, size) {
        return requestUrl('get', `/articles/${uid}/archive/${archive}/${index}/${size}`)
    }
}
export default articles
