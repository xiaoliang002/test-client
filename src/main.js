import {createApp} from 'vue'
import App from './App.vue'
// layui
import Layui from '@layui/layui-vue'
import '@layui/layui-vue/lib/index.css'

// 代码块ui 预览版
/*
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import hljs from 'highlight.js';


VMdPreview.use(githubTheme, {
    Hljs: hljs,
});
*/


//引入element plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// Element Plus 额外提供了一系列类名，用于在某些条件下隐藏元素。 这些类名可以添加在任何 DOM 元素或自定义组件上。 如果需要，请自行引入以下文件：
import 'element-plus/theme-chalk/display.css'
import 'xterm/css/xterm.css'
//引入图标视图
import * as ELIcons from '@element-plus/icons-vue'
//引入路由配置及规则
import router from './router'

// 创建app实例
const app = createApp(App)
//  所有图标库
for (let iconName in ELIcons) {
    app.component(iconName, ELIcons[iconName])
}

app.use(Layui)
app.use(ElementPlus)
app.use(router)
// 代码块ui
// app.use(VMdPreview);

//挂载
app.mount('#app')
