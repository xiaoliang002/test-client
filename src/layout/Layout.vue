<template>
  <div class="common-layout">
    <!-- container整体布局 -->
    <el-container style="height: 100vh;">
      <!-- 侧边栏，定义默认宽度 asideWidth 动态宽度，因为有折叠按钮要自适应-->
      <el-aside :width="asideWidth" class="aside">
        <!-- 固钉，将平台logo和名字固钉在侧边栏最上方 可以固定整个菜单布局，哪怕子菜单数据很多也回固定在一个地方可以进行拉伸操作-->
        <!-- z-index是显示优先级 -->
        <el-affix :z-index="1200" class="aside-affix">
          <div class="aside-logo">
            <!-- logo图片 -->
            <el-image :src="logo" class="logo-image"/>
            <!-- 平台名，折叠后不显示，如果isCollapse 为true进行折叠 -->
            <span :class="[isCollapse ? 'is-collapse' : '']">
                            <span class="logo-name">Open ops </span>
                            <span class="logo-name2">DevOps2.0</span>
                        </span>
          </div>
        </el-affix>

        <!-- ==============导航分割线=================================导航分割线==================================== -->
        <!-- 这里未来需要修整到动态路由-->
        <!-- 菜单导航栏 -->
        <!-- router 使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
        <!-- default-active 当前激活菜单的index,将菜单栏与路径做了对应关系 -->
        <!-- collapse 是否折叠 -->
        <!-- background 导航栏整个背景色-->
        <!-- text-color 字体颜色-->
        <!-- active-text-color 点击后的颜色-->
        <el-menu :collapse="isCollapse"
                 :default-active="$route.path"
                 active-text-color="#20a0ff"
                 background-color="#20222A"
                 class="aside-menu"
                 hidden-xs-only
                 router
                 text-color="#bfcbd9">
          <!-- for循环路由规则 -->
          <div v-for="menu in routers" :key="menu">
            <!-- 没有子路由菜单情况 -->
            <el-menu-item v-if="menu.children && menu.children.length == 1" :index="menu.children[0].path"
                          class="aside-menu-item">
              <!-- 引入图标的方式 -->
              <el-icon>
                <component :is="menu.children[0].icon"/>
              </el-icon>
              <template #title>
                <!-- 这里用的子路由name字段children内第一个-->
                {{ menu.children[0].name }}
                <!--  当然也可以直接使用父路由name字段，前提是name字段必须定义-->
                <!--  {{menu.name}}-->
              </template>
            </el-menu-item>
            <!-- 路由分层-->
            <!-- 父菜单 -->
            <!-- 注意el-menu-item在折叠后，title的部分会自动消失，但el-sub-menu不会，需要自己控制 -->
            <!-- 判断子菜单大于1的情况下，会展示子数据，等于1的情况下说明只有父路由，没有子路由，那就直接展示父菜单-->
            <el-sub-menu v-else-if="menu.children && menu.children.length > 1" :index="menu.path" class="aside-submenu">
              <template #title>
                <!--                              可以自定义icon-->
                <el-icon>
                  <component :is="menu.icon"/>
                </el-icon>
                <span :class="[isCollapse ? 'is-collapse' : '']">{{ menu.name }}</span>
              </template>
              <!-- for循环子菜单 -->
              <div v-for="child in menu.children" :key="child">
                <!-- 只展示show=true -->
                <div v-if="child.show">
                  <el-menu-item :index="child.path"
                                class="aside-menu-childitem">
                    <template #title>
                      <!-- 可以自定义icon-->
                      <el-icon>
                        <component :is="child.icon"/>
                      </el-icon>
                      {{ child.name }}
                    </template>
                  </el-menu-item>
                </div>
              </div>

            </el-sub-menu>
          </div>
        </el-menu>
        <!-- ==============导航分割线=================================导航分割线==================================== -->

      </el-aside>
      <!-- header、main、以及footer -->
      <el-container>
        <!-- header -->
        <el-header class="header">
          <el-row :gutter="20">
            <el-col :span="1">
              <!-- 折叠按钮 -->
              <div class="header-collapse " @click="onCollapse">
                <el-icon>
                  <component :is="isCollapse ? 'expand':'fold'"/>
                </el-icon>
              </div>
            </el-col>
            <el-col :span="10">
              <!-- 面包屑 -->
              <div class="header-breadcrumb hidden-xs-only">
                <!-- separator 分隔符 -->
                <el-breadcrumb separator="/">
                  <!-- :to="{ path: '/' }"表示跳转到/路径 -->
                  <el-breadcrumb-item :to="{ path: '/' }">工作台</el-breadcrumb-item>
                  <!-- this.$route.matched 可以拿到当前页面的路由信息 -->
                  <template v-for="(matched,m) in this.$route.matched" :key="m">
                    <el-breadcrumb-item v-if="matched.name != undefined">
                      {{ matched.name }}
                    </el-breadcrumb-item>
                  </template>
                </el-breadcrumb>
              </div>
            </el-col>
            <el-col :span="13" class="header-menu hidden-xs-only">
              <!-- 头部导航 -->
              <el-dropdown>
                <div class="header-convenient">
                  <span>便捷操作</span>
                </div>
                <!-- 下拉框内容 -->
                <template #dropdown>
                  <el-dropdown-menu class="header-convenient">
                    <el-dropdown-item>cms</el-dropdown-item>
                    <el-dropdown-item divided>jenkins</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-dropdown>
                <!-- 头像及用户名 -->
                <div class="header-dropdown">
                  <span>{{ username }}</span>
                </div>
                <!-- 下拉框内容 -->
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="logout()">退出</el-dropdown-item>
                    <el-dropdown-item>修改密码</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-col>
          </el-row>
        </el-header>
        <!-- main 标签 -->
        <el-main class="main">
          <!-- 路由占位符，展示匹配到对应路由的视图组件 -->
          <router-view></router-view>
        </el-main>
        <!-- footer 标签  -->
        <el-footer class="footer hidden-xs-only">
          <!--                    <el-icon style="width:2em;top:3px;font-size:18px"><place/></el-icon>-->
          <a class="footer el-icon-place" style="width:2em;top:3px;font-size:10px">功能努力开发中。。</a>
        </el-footer>
        <!-- 返回顶部，其实是返回el-main的顶部 -->
        <el-backtop target=".el-main"></el-backtop>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {useRouter} from 'vue-router'

export default {
  data() {
    return {
      //实时屏幕宽度
      windowWidth: document.documentElement.clientWidth,
      //实时屏幕高度
      windowHeight: document.documentElement.clientHeight,
      //导入头像图片
      avator: require('@/assets/img/avator.png'),
      //导入logo图片
      logo: require('@/assets/img/开放的生态.png'),
      //控制导航栏折叠
      isCollapse: false,
      //导航栏宽度
      asideWidth: '231px',
      //路由规则
      routers: [],
    }
  },
  computed: {
    //获取用户名
    username() {
      let username = localStorage.getItem('username');
      //三元运算
      return username ? username : '未知用户';
    },
  },
  methods: {
    //控制折叠
    onCollapse() {
      if (this.isCollapse) {
        // 默认展开
        this.asideWidth = '220px'
        this.isCollapse = false
      } else {
        this.asideWidth = '64px'
        this.isCollapse = true
      }
    },
    //退出
    logout() {
      //移除token认证信息
      localStorage.removeItem('username');
      localStorage.removeItem('token');
      // 跳转登入
      this.$router.push('/login');
    }
  },
  watch: {
    leftSelect: (newValue, oldValue) => {
      this.$refs.leftMenue.activeIndex = to.path;
    },
    // 屏幕监控
    windowHeight(val) {
      let that = this;
      // console.log("实时屏幕高度：", val, that.windowHeight);
      if (val < 700) {
        // console.log("小于800")
        this.asideWidth = '64px'
        this.isCollapse = true
      }
    },
    windowWidth(val) {
      let that = this;
      // console.log("实时屏幕宽度：", val, that.windowHeight);
      if (val < 600) {
        // console.log("小于800")
        this.asideWidth = '64px'
        this.isCollapse = true
      }
    },
  },
  beforeMount() {
    //使用useRouter().options.routes方法获取路由规则
    this.routers = useRouter().options.routes
  },
  mounted() {
    var that = this;
    // <!--把window.onresize事件挂在到mounted函数上-->
    window.onresize = () => {
      return (() => {
        window.fullHeight = document.documentElement.clientHeight;
        window.fullWidth = document.documentElement.clientWidth;
        that.windowHeight = window.fullHeight;  // 高
        that.windowWidth = window.fullWidth; // 宽
      })()
    };

  }


}
</script>


<style scoped>
/* 侧边栏折叠速度，背景色 */
.aside {
  transition: all .2ms;
  background-color: #20222A;
}

/* 固钉，以及logo图片和平台名的属性 */
.aside-logo {
  background-color: #20222A;
  height: 60px;
  color: white;
}

/*菜单栏logo */
.logo-image {
  width: 40px;
  height: 40px;
  top: 12px;
  padding-left: 12px;
}

/*菜单栏标题 open ops */
.logo-name {
  font-size: 20px;
  font-weight: bold;
}

/*菜单栏标题 devops */
.logo-name2 {
  font-size: 10px;
  text-decoration: overline;
  color: #03A9F4;

}

/* 滚动条不展示 */
.aside::-webkit-scrollbar {
  display: none;
}

/* 修整边框，让边框不要有溢出 */
.aside-affix {
  border-bottom-width: 0;
}

.aside-menu {
  border-right-width: 0;
}

/* 菜单栏的位置以及颜色 */
.aside-menu-item.is-active {
  background-color: #1f2a3a;
  font-size: 15px;
}

.aside-menu-item {
  /*dashboard 导航位置*/
  padding-left: 50px !important;
}

.aside-menu-item:hover {
  background-color: #142c4e;

}

.aside-menu-childitem {
  padding-left: 40px !important;
}

.aside-menu-childitem.is-active {
  background-color: #1f2a3a;
}

.aside-menu-childitem:hover {
  background-color: #142c4e;
}

/* header的属性,导航伸缩按钮图标 */
.header {
  background: #f3f3f4;
  z-index: 1200;
  line-height: 60px;
  font-size: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)

}

/* 折叠按钮 */
.header-collapse {
  cursor: pointer;

}

/* 面包靴 */
.header-breadcrumb {
  padding-top: 0.9em;

}

/* 用户信息靠右 */
.header-menu {
  text-align: right;
  background: #f3f3f4;
}

/* 导航折叠属性 */
.is-collapse {
  display: none;
}


/*多级导航配置*/
.aside-submenu {
  /*字体位置*/
  font-weight: lighter;
}

/* 便捷操作下拉框 */
.header-convenient {
  line-height: 60px;
  margin-right: 20px;
  /*点击效果*/
  cursor: pointer;
  vertical-align: middle;
  font-weight: lighter;
}

/* 用户信息下拉框 */
.header-dropdown {
  line-height: 60px;
  cursor: pointer;
  vertical-align: middle;
  font-weight: lighter;
}

/* 头像 */
.avator-image {
  top: 12px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 8px;
}

/*核心内容区域*/
.main {
  padding: 10px;
  background: #f3f3f4;
  /*右边界值*/
  margin-right: 10px;
}

/*底部信息*/
.footer {
  z-index: 1200;
  color: rgb(187, 184, 184);
  font-size: 14px;
  text-align: center;
  line-height: 60px;
  background: white;
}

</style>
