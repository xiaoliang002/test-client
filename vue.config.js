const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        host: '0.0.0.0',//监听地址
        port: 7070, // 启动端口号
        open: false,  // 启动后是否自动打开网页
        proxy: {//配置跨域
            '/api': {
                // target: 'http://192.168.0.3:8000/api/',//这里后台的地址模拟的;应该填写你们真实的后台接口
                target: 'https://opsapi.gongbaojin.com/api',//这里后台的地址模拟的;应该填写你们真实的后台接口
                ws: true,
                changOrigin: true,//允许跨域
                pathRewrite: {
                    '^/api': ''//请求的时候使用这个api就可以
                }
            }
        },
    },
    //关闭语法检测
    lintOnSave: false
})
