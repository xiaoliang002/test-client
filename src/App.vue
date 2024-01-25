<template>
<!--  这里的内容会在全局显示-->
<!--  <span>我是App.vue</span>-->
  <!-- 路由占位符 -->
  <router-view></router-view>
</template>

<style>
  .html, body {
    /*宽高*/
    width: 100%;
    height: 100%;
    /*内边距与外边距*/
    padding: 0;
    margin: 0;
  }
  #nprogress .bar {
        /*自定义进度条颜色*/
        background: #2186c0 !important;
    }
</style>
