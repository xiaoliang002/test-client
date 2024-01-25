<template>
  <el-row :gutter="1">
    <!--头部导航-->
    <el-col :span="24">
      <el-card shadow="never">
        <router-link to="/domain">
          <img class="head" src="@/assets/img/回退.png">
        </router-link>
        <span>
          域名解析： {{ this.$route.query.domain }}
        </span>

      </el-card>
    </el-col>
    <!-- 表单数据-->
    <el-col :span="16">
      <el-card :body-style="{padding:'0px'}" shadow="never">
        <!-- 表单头部-->
        <el-row justify="space-between">
          <el-col :span="6">
            <el-tooltip content="添加记录" disabled="disabled">
              <el-button class="tables" color="#0070CC" size="default" type="primary" @click="drawerDns.drawer = true">
                添加记录
              </el-button>
            </el-tooltip>
          </el-col>
          <!-- 搜索-->
          <el-col :span="14">
            <el-col>
              <el-input v-model="searchInput" class="search" clearable placeholder="请输入"></el-input>
            </el-col>
            <el-col :span="6">
              <el-button color="#0070CC" icon="Search" type="warning" @click="getSearch()">搜索</el-button>
            </el-col>
          </el-col>
        </el-row>
        <!-- 表单数据-->
        <div>
          <el-table :data="tableData"
                    :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                    highlight-current-row
                    style="width: 100%;font-size: 12px"
                    table-layout="fixed"
                    @current-change="selected">
            <el-table-column fixed="left" label="主机记录" prop="RR"/>
            <el-table-column label="记录值" prop="Value"/>
            <el-table-column label="备注" prop="Remark"/>
            <el-table-column label="类型" prop="Type"/>
            <el-table-column label="状态" prop="Status" width="100">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-tag v-if="scope.row.Status !== 'ENABLE'" type="warning">暂停</el-tag>
                  <el-tag v-if="scope.row.Status === 'ENABLE'" type="success">正常</el-tag>
                </div>
              </template>
            </el-table-column>

            <el-table-column fixed="right" label="操作" width="160">

              <template #default="scope">
                <el-dropdown @command="functionDown">
                  <el-button size="small" type="primary">
                    功能操作
                    <el-icon class="el-icon--right">
                      <arrow-down/>
                    </el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item :command="beforeHandleCommand(scope.$index, scope.row,'a')"
                                        style="font-size: 12px">Ping
                      </el-dropdown-item>
                      <el-dropdown-item :command="beforeHandleCommand(scope.$index, scope.row,'b')"
                                        style="font-size: 12px">编辑备注
                      </el-dropdown-item>
                      <el-dropdown-item :command="beforeHandleCommand(scope.$index, scope.row,'c')"
                                        style="font-size: 12px">查看主体
                      </el-dropdown-item>
                      <el-dropdown-item :command="beforeHandleCommand(scope.$index, scope.row,'d')"
                                        style="font-size: 12px">在线终端
                      </el-dropdown-item>
                      <el-dropdown-item :command="beforeHandleCommand(scope.$index, scope.row,'e')"
                                        style="font-size: 12px">删除解析
                      </el-dropdown-item>
                      <el-dropdown-item :command="beforeHandleCommand(scope.$index, scope.row,'f')"
                                        style="font-size: 12px">查看证书
                      </el-dropdown-item>
                      <el-dropdown-item :command="beforeHandleCommand(scope.$index, scope.row,'g')"
                                        style="font-size: 12px">暂停解析
                      </el-dropdown-item>
                      <el-dropdown-item :command="beforeHandleCommand(scope.$index, scope.row,'s')"
                                        style="font-size: 12px">启用解析
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页-->
          <el-pagination
              :current-page="currentPage"
              :page-size="pageSize"
              :page-sizes="[10, 20, 30, 40]"
              :total="total"
              background
              layout="total, sizes, prev, pager, next, jumper"
              small
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
          />
        </div>

      </el-card>
    </el-col>
    <!-- 终端-->
    <el-col :span="8">
      <el-alert class="terminalMsg" show-icon title="Jumpserver同款终端、提供完整的命令行便捷操作、回车即可！" type="info"/>
      <el-empty v-if="showXtermloaded" description="在线终端"/>
      <el-card v-if="showXterm" style="background: #0d0d0e">
        <Xterms id="xterm" :terminal="terminal"/>
      </el-card>

    </el-col>
  </el-row>

  <!--创建解析-->
  <el-drawer v-model="drawerDns.drawer" :before-close="handleClose" :direction="drawerDns.direction">
    <template #title>
      <h4>解析 {{ this.$route.query.domain }}</h4>
    </template>
    <template #default>
      <el-row justify="center" type="flex">
        <el-col :span="20">
          <el-form ref="createDnss" :model="createDnss" :rules="drawerDns.createDnsRules" label-width="80pxsouType">
            <!--提示消息-->
            <el-alert :closable="false" show-icon
                      style="margin: 20px 0 0; font-size: 8px;"
                      title="从运维后台拉取解析源支持毫秒级模糊检索，跨平台、跨账号、ecs rds slb .. 使用云厂商创建资产配置的别名,建议命名规范提高阅读性" type="success"/>
            <el-form-item label="解析类型" prop="Type">
              <el-select v-model="createDnss.Type" filterable placeholder="解析类型">
                <el-option
                    v-for="item in drawerDns.analyticType"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value">
                  <span style="float: left ; font-size: 12px;">{{ item.value }}</span>
                  <span
                      style="float: right;color: var(--el-text-color-secondary); font-size: 10px; ">{{ item.label }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="主机记录" prop="RR">
              <el-input v-model="createDnss.RR" placeholder="子域名&多级域名"></el-input>
            </el-form-item>
            <el-form-item label="源选择" prop="souType">
              <el-select v-model="createDnss.souType" placeholder="请选择">
                <el-option label="从运维后台获取" style="font-size: 12px" value="cms"></el-option>
                <el-option label="手动填写" style="font-size: 12px" value="manual"></el-option>
              </el-select>
            </el-form-item>
            <!--选择手动输入-->
            <el-form-item v-if="createDnss.souType === 'manual'" label="记录值"
                          prop="Value">
              <el-input v-model="createDnss.Value" placeholder="示例: 192.168.0.0.1"></el-input>
            </el-form-item>
            <!--选择运维后台-->
            <el-form-item v-if="createDnss.souType === 'cms'" label="筛选" prop="Value">
              <el-select v-model="createDnss.Value" filterable placeholder="Assets.Server.info">
                <el-option
                    v-for="item in options"
                    :key="item.InstanceName"
                    :label="item.InstanceName"
                    :value="item.PublicIpAddress">
                  <span
                      style="color: var(--el-text-color-secondary); font-size: 10px; ">{{ item.InstanceName }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="备注" prop="Remark">
              <el-input v-model="createDnss.Remark" type="textarea"/>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </template>
    <template #footer>
      <el-button @click="drawerDns.drawer = false">取消</el-button>
      <el-button type="primary" @click="dnsForm(createDnss)">立即创建</el-button>
    </template>

  </el-drawer>

</template>

<style>
/*表单样式*/
.tables {
  font-size: var(--el-font-size-extra-small);
}

.terminalMsg {
  font-size: var(--el-font-size-extra-small);
}

.search {
  width: 170px;
  /*margin-left: 20px;*/
  margin-right: 10px;
}

</style>
<script>
import Xterms from "../../../components/XTerms";
import httpClient from "@/utils/request";

let token = localStorage.getItem('token')
import common from "../../common/HttprequestUrl";
import dns from "./createDns";

export default {
  data() {
    return {
      // 抽屉表单
      drawerDns: dns,
      loading: false, // 抽屉重载
      souType: null,
      // 抽屉最终输入的数据源带给后端
      createDnss: {
        DomainName: this.$route.query.domain, // 域名名称
        RR: '', // 主机记录
        Type: '', // 解析类型
        Value: '', // 记录值
        Remark: '',  // 备注
        souType: null,
      },

      domainUrl: common.domainDns, // 获取域名解析列表接口
      addDnsUrl: common.addDnsUrl, // 新增域名解析记录
      assetsUrl: common.assets.server, // 获取资产信息
      deleteDnsUrl: common.deleteDnsUrl, // 删除解析

      // 分页配置
      currentPage: 1, // 当前页
      pageSize: 10,   // 一页显示的数量
      total: 0, // 总数量

      showXterm: false,
      showXtermloaded: true,
      // 状态栏
      iconCheck: "true", // 打开效果 icon
      iconClose: "false", //关闭效果 icon
      switcH: true,
      // 终端自定义配置
      config: {},
      // 终端url
      terminal: {
        testUrl: "wss://opsapi.gongbaojin.com/ws/webssh/testUrl/" + "?token=" + token,
      },
      // 状态栏
      searchInput: "", // 搜索框数据
      tableData: [
        {
          DomainName: '正在加载。。',
          Value: '正在加载。。',
          Remark: '正在加载。。',
          RR: "正在加载。。",
          Type: "正在加载。。",
          Status: "ENABLE",
        },
      ],
      // 从cms获取服务器信息下拉菜单
      options: [],
    }
  },
  methods: {
    // 表单、单选事件
    selected(xxxx) {
      console.log("选择了", xxxx)
    },
    // 表单搜索
    getSearch() {
      this.getData(this.domainUrl)
    },
    // 表单操作功能，需要触发该函数才能把多参数以对象形式传过来
    beforeHandleCommand(index, row, command) {
      return {
        'index': index,
        'row': row,
        'command': command
      }
    },
    // 这里就是表单具体操作对象数据了
    functionDown(command) {
      switch (command.command) {
        case "a":
          console.log(command.command, command.row);
          this.$message.success({message: "功能待开放"})
          break;
        case "b":
          console.log(command.command, command.row);
          this.$message.success({message: "功能待开放"})
          break;
        case "c":
          console.log(command.command, command.row);
          this.$message.success({message: "功能待开放"})
          break;
        case "d":
          console.log(command.command, command.row);
          this.pingShell("主页", "数据")
          break;
        case "e":  // 删除解析
          console.log(command.command, command.row);
          var sendData = {
            "RecordId": command.row.RecordId,
            "DomainName": this.$route.query.domain
          }
          httpClient.post(this.deleteDnsUrl, JSON.stringify(sendData)).then(res => {
            console.log(res)
            this.getData(this.domainUrl)
          }).catch(res => {
            console.log(res)
            this.$message.error({message: "删除失败"})
          })
          break;
        case "g":
          console.log(command.command, command.row);
          this.$message.success({message: "功能待开放"})
          break;
        case "s":
          console.log(command.command, command.row);
          this.$message.success({message: "功能待开放"})
          break;
      }
    },

    pingShell(index, row) {
      if (this.showXtermloaded) {
        console.log(index, row)
        this.showXterm = true
        this.showXtermloaded = false
      }
    },
    // 获取数据源&表单分页
    getData(urls) {
      var sendData = {
        "domain_name": this.$route.query.domain,
        "page_number": this.currentPage,
        "page_size": this.pageSize,
        "rr_key_word": this.searchInput
      }

      httpClient.post(urls, JSON.stringify(sendData)).then(res => {
        var bodys = res.results.results.body
        // console.log(bodys)
        this.tableData = bodys.DomainRecords.Record
        // console.log(this.tableData)
        // 初自请求拿到总数量
        this.total = bodys.TotalCount
      }).catch(res => {
        console.log(res)
        this.$message.error({
          message: "获取数据源失败"
        })
      })
    },
    // 每页大小
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getData(this.domainUrl)
    },
    // 拿当前页重新请求
    handleCurrentChange(currentPage) {
      console.log("当前页", currentPage)
      this.currentPage = currentPage
      // this.urls = `${this.domainUrl}?limit=${this.pageSize}&offset=${this.currentPage}`
      this.getData(this.domainUrl)

    },
    //dns解析抽屉取消确认提示
    handleClose(done) {
      this.$confirm('关闭确认！')
          .then(() => {
            done();
          })
          .catch(() => {
          });
    },
    // 创建抽屉表单提交
    dnsForm(formData) {
      console.log(formData)
      this.$refs['createDnss'].validate((valid) => {
        console.log(valid)
        if (valid) {
          this.handleSave(formData)
          this.drawerDns.drawer = false // 关闭抽屉
          // 提交成功重置数据
          this.$refs['createDnss'].resetFields()
        } else {
          console.log('创建抽屉表单验证失败!')
          return false
        }
      })

    },
    // 保存抽屉信息的创建信息
    async handleSave(formData) {
      try {
        let {
          DomainName,
          RR,
          Type,
          Value,
          Remark
        } = formData // 过滤不需要的字段 这里会自动解析
        let resData = await httpClient.post(this.addDnsUrl, JSON.stringify({
          DomainName,
          RR,
          Type,
          Value,
          Remark
        }))
        await this.getData(this.domainUrl)

        if (resData.status === 'fail') {
          this.$message.error({
            message: resData.data.message
          })
        }
      } catch (error) {
        this.$message.error({
          message: error.message
        })
      }
    },
    // 获取服务信息
    async getServerCms() {
      try {
        let res = await httpClient.get(this.assetsUrl)
        if (res) {
          for (var key in res) {
            if (res[key].PublicIpAddress) {
              // console.log(res[key])
              this.options.push(res[key])
            }
          }
        }
      } catch (error) {
        this.$message.error({
          message: "获取资产信息失败"
        })
      }

    },


  },
  // 初始化表格数据
  mounted: function () {
    this.getData(this.domainUrl)
    this.getServerCms()

  },
  components: {
    // 终端插件模块
    Xterms
  },
  // 父页面带过来的数据
  props: {},

}

</script>
