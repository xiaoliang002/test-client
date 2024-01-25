import {createRouter, createWebHistory} from 'vue-router'
//导入进度条组件
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

//导入Layout
import Layout from '@/layout/Layout'

//定义路由规则
const routes = [
    // 根目录，redirect 重定向到首页
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/login',
        component: () => import('@/views/login/Login.vue'),
        icon: "odometer",
        name: 'Login',
        meta: {title: "欢迎访问一站式运维管理平台(登入)", requireAuth: false},
    },
    {
        path: '/home', //视图
        component: Layout, // Layout 是最外层一套布局，父页面，当引用后会继承在一起
        icon: "MostlyCloudy", // 图标，参考element-plus 提供的icon名称
        meta: {title: "仪表盘", requireAuth: false}, //定义meta元数据，title 访问该负面标题，requireAuth用于权限校验
        name: '仪表盘',
        children: [
            {
                path: '/home', //视图
                name: 'Dashboard',
                component: () => import('@/views/home/Home.vue'), //会自动继承Layout，然后再展示该视图组件
                icon: "MostlyCloudy", //图标
                meta: {title: "仪表盘&数据服务", requireAuth: false}, //定义meta元数据
            }
        ]
    },
    {
        path: '/domain',
        name: '应用程序',
        component: Layout,
        icon: 'menu',
        meta: {title: '应用程序', requireAuth: true},
        children: [
            {
                path: '/domain',
                name: '域名服务',
                icon: 'Football',
                meta: {title: 'domain', requireAuth: true},
                show: true, // 是否在菜单栏展示
                component: () => import('@/views/domain/DomainList.vue')
            },
            {
                path: '/domain/create',
                name: '创建域名',
                icon: 'Edit',
                meta: {title: '创建域名', requireAuth: true},
                show: false,
                component: () => import('@/views/domain/DomainCreate.vue')
            },
            {
                path: '/domain/dns',
                name: '管理解析',
                icon: 'Edit',
                meta: {title: '管理解析', requireAuth: true},
                show: false,
                component: () => import('@/views/domain/dns/DomainDns.vue')
            },

            {
                path: '/configuration',
                name: '配置中心',
                icon: 'Edit',
                meta: {title: '配置中心', requireAuth: true},
                show: false,
                component: () => import('@/views/domain/DomainCreate.vue')
            },
            {
                path: '/test1',
                name: 'test1',
                icon: 'Edit',
                meta: {title: 'test1', requireAuth: true},
                show: false,
                component: () => import('@/views/domain/pagingTest')
            },
            {
                path: '/test',
                name: 'test',
                icon: 'Edit',
                meta: {title: 'test', requireAuth: true},
                show: false,
                component: () => import('@/views/domain/test.vue')
            }
        ]
    },
    {
        path: '/tool',
        name: '资产信息',
        component: Layout,
        icon: 'Tickets',
        meta: {title: '工具集合', requireAuth: true},
        children: [
            {
                path: '/tool',
                name: '主机信息',
                icon: 'Cpu',
                meta: {title: 'domain', requireAuth: true},
                show: true, // 是否在菜单栏展示
                component: () => import('@/views/domain/DomainList.vue')
            },
            {
                path: '/tool',
                name: '中间件',
                icon: 'Tools',
                meta: {title: 'domain', requireAuth: true},
                show: true, // 是否在菜单栏展示
                component: () => import('@/views/domain/DomainList.vue')
            },
        ]
    },
    {
        path: '/404',
        component: () => import('@/views/common/404.vue'),
        meta: {title: "404", requireAuth: true},
    },

    // 如果上面的路由都没有匹配到，强制跳转到/404 页面
    {
        path: '/:pathMatch(.*)',
        redirect: '/404',
    },
]

//创建路由实例
const router = createRouter({
    history: createWebHistory(),
    routes
})

//进度条配置
NProgress.inc(0.2) //设置进度条递增
NProgress.configure({easing: 'ease', speed: 600, showSpinner: false})//动画效果、动画速度、进度环是否显示

const whiteList = ['/login', '/404']

//路由守卫，路由拦截，也就是在访问url之前做一些逻辑处理，通常用于jtw认证
router.beforeEach((to, from, next) => {
    //启动进度条
    NProgress.start()
    //设置头部
    if (to.meta.title) {
        // 如果当前标题元素，也就是上面设置的routes路由信息中 meta信息不为空，就使用该信息填充到页面标题
        document.title = to.meta.title
    } else {
        document.title = "运维开放平台"
    }
    // 检查token
    const token = localStorage.getItem("token")
    if (token) {
        // 存在，继续访问
        next()
    } else {
        // 不存在，需要登录；
        // 未登录的时候，访问的页面是不是在白名单，在白名单，可以访问；不再，就去登录页面；
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next('/login')
        }
    }
})

//上面逻辑结束后，那就是展示正常也页面直接关闭进度条
router.afterEach((to, from, next) => {
    // 这里步填写参数也没关系
    NProgress.done()
})


export default router
