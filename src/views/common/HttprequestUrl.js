// 后端请求路由地址
const CMS = "/api/"
const VERSION = "v1"
export default {
    login: CMS + 'token/',
    // 资产表单
    assets: {
        project: CMS + VERSION + '/project/', // 项目属性
        collection: CMS + VERSION + '/collection/', // 配置中心
        server: CMS + '/aliyunecs/', // 服务器
    },
    // 创建托管域名(增删改查)
    domain: CMS + VERSION + '/domain/',
    createDomain: CMS + VERSION + '/create/domain/',

    // 获取指定域名解析记录
    domainDns: CMS + VERSION + '/dns/domain/',
    // 创建解析记录
    addDnsUrl: CMS + VERSION + '/dns/add/',

    // 删除解析记录
    deleteDnsUrl: CMS + VERSION + '/dns/delete/',

    // 指定域名修改（这里具体修改备注还是解析待定）
    domainModify: CMS + 'api/login',


}


