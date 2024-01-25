import {validateIP} from "@/views/common/validator";


// 抽屉
export default {
    // 抽屉 创建解析域
    drawer: false, // 默认抽屉隐藏状态
    direction: 'rtl', // 抽屉出现方向（右边）

    // 抽屉字段校验
    createDnsRules: {
        Type: [{
            required: true,
            message: '请选择解析类型',
            trigger: 'change'
        }],
        RR: [{
            required: true,
            message: '请输入主机记录',
            trigger: 'change'
        }],
        souType: [{
            required: true,
            message: '请选择解析来源',
            trigger: 'change'
        }],
        Remark: [{
            required: true,
            message: '为了能让业务属性更加清晰备注必填选项!',
            trigger: 'change'
        }],
        Value: [{required: true, message: '请输入正确的IP地址', validator: validateIP, trigger: 'blur'}],
    },
    // 抽屉 域名解析类型
    analyticType: [
        {
            value: 'A',
            label: '-将域名指向一个IPV4地址',
        },
        {
            value: 'CNAME',
            label: '-将域名指向另外一个域名',
        },
        {
            value: 'AAAA',
            label: '-将域名指向一个IPV6地址',
        },
        {
            value: 'NS',
            label: '-指定其它DNS服务器解析',
        },
        {
            value: 'MX',
            label: '-将域名指向邮箱服务器',
        },
        {
            value: 'TXT',
            label: '-文本长度限制512',
        },
        {
            value: 'CAA',
            label: '-CA证书颁发结构授权校验',
        },
    ],


}
