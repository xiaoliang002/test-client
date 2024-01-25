<template>
  <el-row :gutter="20">

    <!--头部提示-->
    <el-col :span="24">
      <el-alert
          description="添加域名之前确保在配置中心录入了相关认证信息.
          本质上运维内部系统使用环境并不需要精细化的复杂权限,当然并不代表没有，关于该页面的操作权限可通过CMS后台用户中心添加～"
          title="温馨提示！"
          type="success"
      />
    </el-col>

    <!--头部按钮 添加域名 -->
    <el-col :span="24">
      <div style="margin-bottom:5px">
        <el-tooltip :disabled="disabled" content="创建托管域名">
          <el-button size="default" type="primary" @click="resetDateFilter">添加域名</el-button>
        </el-tooltip>
      </div>

    </el-col>

    <!--数据表格-->
    <el-col :span="24">
      <!--shadow="never" 去除阴影效果-->
      <el-card shadow="never">
        <!--  :header-cell-style="{background:'#eef1f6',color:'#606266'}" 针对表格头部样式控制-->
        <el-table
            ref="tableRef"
            :data="tableData.filter(data => !search || data.domain_name.toLowerCase().includes(search.toLowerCase()))"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            row-key="id">
          <!--column-key 支持筛选，prop="date" 对应内容字段-->
          <el-table-column column-key="date" label="证书过期(待开放)" prop="date" sortable/>
          <el-table-column fixed label="主体域名" prop="domain_name"/>

          <!-- tag标签 filters参数，支持的过滤器内容是写死的-->
          <el-table-column
              :filter-method="filterTag"
              :filters="[
        { text: '电子保函', value: '工保金' },
        { text: '工保网', value: '工保网' },
      ]"
              filter-placement="bottom-end"
              label="Tag"
              prop="project">
            <template #default="scope">
              <el-tag
                  :type="scope.row.project === 'project' ? '' : 'success'"
                  disable-transitions
              >{{ scope.row.project }}
              </el-tag
              >
            </template>
          </el-table-column>

          <!--额外的搜索框,自定义表头-->
          <el-table-column fixed="right">
            <template #header>
              <el-input v-model="search" placeholder="关键字搜索" size="small"/>
            </template>
            <template #default="scope">
              <el-button icon="Edit" prop="id" size="small" type="primary" @click="DdsEdit(scope.$index, scope.row)">
                Edit
              </el-button>
              <el-popconfirm title="大兄弟！确定取消托管吗？" @confirm="confirmEvent">
                <template #reference>
                  <el-button icon="Delete" size="small" type="primary" @click="deleteClick(scope.row)">
                    Delete
                  </el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页-->
        <el-pagination
            :current-page="currentPage"
            :page-size="pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :total="total"
            :v-loading="loading"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </el-card>

    </el-col>

  </el-row>


</template>

<script>
import common from "../common/HttprequestUrl";
import httpClient from "../../utils/request";


export default {
  data() {
    return {
      // 需要定义 disabled 不然会有警告信息
      disabled: false,
      domainUrl: common.domain, // 登入接口变量
      tableData: [], // 表单数据
      loading: true,
      search: '', // 默认为空，如果不为空，会拿这里的数据过滤展示
      selectedData: {}, // 选中数据
      // 分页配置
      currentPage: 0, // 当前页
      pageSize: 10,   // 一页显示的数量
      total: 0, // 总数量
      urls: "",
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

    },

    // 标签筛选
    filterTag(value, row) {
      return row.project === value;
    },
    // 创建按钮跳转
    resetDateFilter() {
      this.$router.push({
        path: "/domain/create",
      })
    },
    // 删除托管域名
    deleteData(deleteId) {
      const domainUrl = this.domainUrl
      const id = deleteId

      httpClient.delete(`${domainUrl}${id}/`).then(res => {
        console.log(`${domainUrl}${id}/`)

      }).catch(res => {
        this.$message.error({
          message: "删除失败"
        })
      })
    },
    // 删除事件按钮
    deleteClick(data) {
      this.selectedData = data
    },
    // 确认删除事件按钮
    confirmEvent() {
      console.log("确认删除")
      this.deleteData(this.selectedData.id)
      this.getData(this.domainUrl)


    },
    // 分页触发后

    // DNS 解析
    DdsEdit(scope, row) {
      console.log(row.domain_name)
      this.$router.push({
        path: "/domain/dns",
        query: {domain: row.domain_name}
      })
    }

  },

  mounted: function () {
    this.getData(this.domainUrl)

  },

}
</script>


