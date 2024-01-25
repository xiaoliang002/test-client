import axios from 'axios'
import router from "@/router";

// axios对象
const httpClient = axios.create({
    validateStatus(status) {
        return status >= 200 && status < 504 // 这里是通用的配置、判断在指定的状态码中是否合法，不合法不提供response进行下去
    },
    timeout: 10000 //超时时间10秒
})

httpClient.defaults.retry = 3 // 请求重试次数
httpClient.defaults.retryDelay = 1000 //请求重试时间间隔
httpClient.defaults.shouldRetry = true //是否重试

//请求拦截器，也就是在发起请求的时候添加一些自定义配置数据请求头，通常用于jwt认证带给后端
httpClient.interceptors.request.use(
    config => {
        //添加header
        config.headers['Content-Type'] = 'application/json'
        config.headers['Accept-Language'] = 'zh-CN'
        config.headers['Authorization'] = "Bearer " + localStorage.getItem("token")

        //处理post请求
        if (config.method === 'post') {
            if (!config.data) {
                config.data = {}
            }
        }
        return config
    },
    err => {
        // 如果处理错了，会把错误信息打印到console中显示
        return Promise.reject(err)
    }
)

//响应拦截器
httpClient.interceptors.response.use(
    response => {
        // debugger
        //处理状态码
        if (response.status) {
            switch (response.status) {
                case 401:
                    localStorage.removeItem('username');
                    localStorage.removeItem('token');
                    return router.push('/login');
                default:
                    return response.data;
            }
        } else {
            // reject方法可以把信息打印console中显示
            return Promise.reject(response)
        }
    },
    err => {
        // 异常错误打印
        return Promise.reject(err.response)

    }
)

export default httpClient
