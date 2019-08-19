let baseURL

// 开发环境
if (process.env.NODE_ENV === 'development') {
    baseURL = 'http://127.0.0.1:81/api'
} else if (process.env.NODE_ENV === 'production') {
    baseURL = 'http://jie12366.xyz:81/'
}

export default baseURL
