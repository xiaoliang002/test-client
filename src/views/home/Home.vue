<template>
  <el-row :gutter="12">
    <el-col v-for="(v,k) in labelData" :lg="6" :md="12" :sm="12" :span="6" :xl="6" :xs="24">
      <el-card shadow="hover">
        <table class="card">
          <tbody>
          <tr>
            <td class="line">{{ k }}
              <div/>
            </td>
            <td class="click">
              <el-dropdown>
                      <span>
                        详情
                        <el-icon>
                          <arrow-down/>
                        </el-icon>
                      </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>Action 1</el-dropdown-item>
                    <el-dropdown-item disabled>Action 4</el-dropdown-item>
                    <el-dropdown-item divided>Action 5</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </td>
          </tr>

          <tr>
            <td class="text">{{ v }}</td>
            <td class="text2">累计统计</td>
          </tr>
          </tbody>
        </table>
      </el-card>
    </el-col>
  </el-row>
</template>


<style scoped>

/*内容样式*/
.card .text {
  font-weight: 900;
  font-size: 40px;
  color: #79bbff;

}

/*累计统计*/
.card .text2 {
  font-size: 10px;
  color: #142c4e;
  text-align: right;
  /*宽度*/
  width: 100px;
}

.card .click {
  font-size: 10px;
  color: #142c4e;
  text-align: right;
  width: 100px;
  cursor: pointer;
}

/*直线与内容对齐长度 标题名称*/
.card .line {
  font-size: var(--el-font-size-extra-small);
}

/*自定义控制直线*/
.card .line div {
  width: 100%;
  height: 0;
  border-top: 1px solid #337ecc;
}

/*卡片底部*/
.card .following {
  font-size: 10px;
  text-align: right;
}

</style>


<script>
export default {
  data() {
    return {
      labelData: {
        "Jenkins工具链": 99999,
        "CmsApi": 99999,
        "小程序": 99999,
        "累计发版": 99999,
      }
    };
  }
}
</script>

