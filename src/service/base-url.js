let baseURL

// 开发环境
if (process.env.NODE_ENV === 'development') {
    baseURL = 'https://jie12366.xyz:81/api'
} else if (process.env.NODE_ENV === 'production') {
    baseURL = 'https://jie12366.xyz:81/api'
}

export default baseURL
