import axios from '@/service/http'
import Qs from 'qs'

// 封装一个restful风格的axios(以url形式传输数据)
export function requestUrl (method, url, data) {
    // 如果请求为get,则将data封装一下
    data = method === 'get' ? {params: data} : data
    return new Promise((resolve, reject) => {
        axios[method](url, Qs.stringify(data))
        .then(res => {
            resolve(res.data)
        }, error => {
            reject(error)
        })
    }).catch(error => {
        console.log(error)
    })
}

// 封装一个restful风格的axios(以json形式传输数据)
export function requestJson (method, url, data) {
    return new Promise((resolve, reject) => {
        axios[method](url, data.data, {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            resolve(res.data)
        }, error => {
            reject(error.data)
        })
    }).catch(function (reason) {
        return reason.data
    })
}
