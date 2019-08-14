let baseURL;

//开发环境
if(process.env.NODE_ENV == 'development'){
    baseURL = '/api';
}
//生产环境
else if(process.env.NODE_ENV == 'production'){
    baseURL = 'http://jie12366.xyz:81/';
}

export default baseURL;