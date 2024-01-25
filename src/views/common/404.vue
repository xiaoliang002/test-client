<template>
  <div class="main-body-div">
    <el-row>
      <!-- 图片 -->
      <el-col :span="24">
        <div>
          <img class="main-body-img" src="../../assets/img/404.png"/>
        </div>
      </el-col>
      <!-- 描述 -->
      <el-col :span="24">
        <div>
          <p class="status-code">404</p>
          <el-alert :closable="false" center show-icon title="该页面也许存在,如果你是个外来者已将本次访问记录后台～" type="error"/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {}
</script>


<style scoped>
/* 图片属性 */
.main-body-img {
  margin-top: 150px
}

/* 整体位置 */
.main-body-div {
  text-align: center;
  height: 100vh;
  width: 100vw;
}

/* 状态码 */
.status-code {
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 95px;
  font-weight: bold;
  color: rgb(54, 95, 230);
}

</style>