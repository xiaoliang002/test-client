<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column label="domain_name" prop="domain_name" width="180"/>
  </el-table>

  <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :total="total"
      background
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
  />
</template>


<script>
import common from "../views/common/HttprequestUrl";
import httpClient from "../utils/request";

export default {

  data() {
    return {
      // 分页配置
      currentPage: 0, // 当前页
      pageSize: 10,   // 一页显示的数量
      total: 0, // 总数量
      // 表单配置
      domainUrl: common.domain,
      tableData: [
        {
          domain_name: 'xxxxx.com',
        },
      ]
    }
  },
  methods: {
    // 获取数据源
    getData(urls) {
      httpClient.get(urls).then(res => {
        console.log(res)
        this.tableData = res.results
        // 初自请求拿到总数量
        this.total = res.count
      }).catch(res => {
        console.log(res)
        this.$message.error({
          message: "获取数据源失败"
        })
      })
    },

    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      console.log("每页大小", pageSize)
      //从后端接口获取列表数据，传入pagesize和currentpage，后端会自动分页
      //this.getList()
    },
    handleCurrentChange(currentPage) {
      console.log("当前页", currentPage)
      this.currentPage = (currentPage - 1) * this.pageSize
      this.urls = `${this.domainUrl}?limit=${this.pageSize}&offset=${this.currentPage}`
      this.getData(this.urls)

    }
  },
  mounted: function () {
    this.getData(this.domainUrl)

  },
}
</script>
