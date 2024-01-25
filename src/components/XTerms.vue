<template>
  <div id="xterm"/>
</template>

<script>
import {Terminal} from 'xterm'
import {FitAddon} from 'xterm-addon-fit'
import {AttachAddon} from 'xterm-addon-attach'


let socket = null;
let token = localStorage.getItem('token')

export default {
  name: "RttyImplement",
  props: {
    // 链接信息
    terminal: {
      type: Object,
      default() {
        return {
          // 默认通信地址
          testUrl: "wss://opsapi.gongbaojin.com/ws/webssh/demo/" + "?token=" + token
        }
      }
    },

    config: {
      type: Object,
      default() {
        return {
          rendererType: 'canvas', //渲染类型
          rows: 30, //行数
          cols: 110,
          convertEol: true, //启用时，光标将设置为下一行的开头
          scrollback: 10, //终端中的回滚量
          disableStdin: false, //是否应禁用输入
          cursorStyle: 'underline', //光标样式
          // cursorBlink: true, //光标闪烁
          // fontWeight: '8', // 字体宽度
          fontSize: 10, // 字体大小
          theme: {
            foreground: 'white', //字体
            background: '#060101', //背景色
            cursor: 'help' //设置光标
          }
        }
      }
    },

  },
  data() {
    return {}
  },
  computed: {},
  mounted() {
    this.initSocket()
  },
  beforeDestroy() {
    socket.close()
  },
  methods: {
    initTerm() {
      const term = new Terminal(this.config)
      term.open(document.getElementById('xterm'))
      // 终端双向发送数据
      const attachAddon = new AttachAddon(socket)
      const fitAddon = new FitAddon()
      // 添加插件到终端的原型上
      term.loadAddon(attachAddon)
      term.loadAddon(fitAddon)
      fitAddon.fit()
      term.focus() // 获取终端焦点
      this.term = term
      // 初始化加上下面这两行不会失去聚焦
      // term._initialized = true
      // term.scrollToBottom()
      // term.refresh(1, 20) // 刷新
      // term.clear()
      // term.write("11111")
      // docs https://juejin.cn/post/6844903809035010055

    },
    initSocket() {
      // socket = new WebSocket(this.termUrl);
      socket = new WebSocket(this.terminal.testUrl);
      console.log(socket)
      // 以下函数异步挂起后台
      this.socketOnOpen()
      this.socketOnClose()
      this.socketOnError()
    },
    socketOnOpen() {
      socket.onopen = () => {
        // 链接成功后
        console.log("--------------open socket-------------")
        this.initTerm() // 初始化

      }
    },
    socketOnClose() {
      socket.onclose = () => {
        console.log('close socket')
        this.$message.error({
          message: "与CMS建立wss通信失败！"
        })
      }
    },
    socketOnError() {
      socket.onerror = () => {
        console.log('socket 链接失败')
      }
    },
    demoTest() {
      console.log("demo_test")
    }
  },

}
</script>
