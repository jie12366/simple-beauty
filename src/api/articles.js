import axios from '@/service/http'

const articles = {
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
    }
}
export default articles
