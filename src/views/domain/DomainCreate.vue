<template>
  <el-row :gutter="5" style="background: white">
    <!--头部（创建托管域名）-->
    <el-col :span="24">
      <el-card shadow="never">
        <h5 style="font-size: var(--el-font-size-medium)">创建托管域名</h5>
      </el-card>
    </el-col>
    <!--表单-->
    <el-col :lg="8" :md="12" :sm="24" :span="8" :xl="8" :xs="24">
      <el-card shadow="never">
        <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="120px">
          <el-alert :closable="false" show-icon type="info">
            <p>请添加主体域名，例如 gongbaojin.cn</p>
          </el-alert>
          <br>
          <el-form-item label="域名地址" prop="domain_name">
            <el-input v-model="form.domain_name"/>
          </el-form-item>
          <el-form-item label="项目属性" prop="project">
            <el-select v-model="form.project" placeholder="绑定到哪个项目？">
              <el-option v-for="data in projectData" :access_Key="data" :label="data" :value="data"/>
            </el-select>
          </el-form-item>
          <el-form-item label="云厂商" prop="vendor_name">
            <el-select v-model="form.vendor_name" placeholder="选择云厂商">
              <el-option label="阿里云" value="aliyun"/>
              <el-option :disabled="true" label="华为云" value="huawei"/>
              <el-option :disabled="true" label="天翼云" value="tianyi"/>
            </el-select>
          </el-form-item>
          <el-form-item label="密钥ID" prop="access_key_id">
            <el-select v-model="form.access_key_id" filterable placeholder="兄弟点我！">
              <el-option
                  v-for="item in access_KeyOptions"
                  :access_Key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="密钥" prop="access_Key">
            <el-select v-model="form.access_Key" filterable placeholder="旁边广告位招租！">
              <el-option
                  v-for="item in access_KeyOptions"
                  :access_Key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-divider content-position="right">operation</el-divider>
          <el-form-item>
            <el-button icon="Back" type="primary" @click="returnDomainList">返回</el-button>
            <el-button :loading="loading" type="primary" @click="createDomain">{{ create }}</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
    <el-col :lg="16" :md="12" :sm="24" :span="16" :xl="16" :xs="24">
      <el-card shadow="never">
        <el-descriptions title="学而时习之">
          <el-descriptions-item label="什么是前端无障碍？"
          >Web 可访问性 (也称为 a11y)
            是指创建可供任何人使用的网站的实践方式——无论是身患某种障碍、通过慢速的网络连接访问、使用老旧或损坏的硬件，还是仅仅是处于不利环境中的人。例如，在视频中添加字幕可以帮助失聪、有听力障碍或身处嘈杂环境而听不到手机的用户。同样，请确保文字对比度不要太低，这对低视力用户和那些试图在强光下使用手机的用户都有帮助
          </el-descriptions-item
          >
        </el-descriptions>
      </el-card>
      <h5 class="hidden-xs-only">广告位</h5>
    </el-col>
    <!--知识库-->
    <el-col :lg="8" :md="12" :sm="24" :span="8" :xl="8" :xs="24">
      <el-card shadow="never">
        <div class="demo-collapse">
          <el-collapse v-model="activeName" accordion>
            <el-collapse-item name="1" title="关于云厂商可用区">
              <h5 class="zhishi">阿里云参考</h5>
              <div>
                <el-table :data="vendor_nameRegionList" size="small" style="width: 100%">
                  <el-table-column label="地域名称" prop="date"/>
                  <el-table-column label="所在城市" prop="name"/>
                  <el-table-column label="RegionID" prop="address"/>
                </el-table>
              </div>
              <h5 class="zhishi">华为云参考</h5>
              <h5 class="zhishi">更新中...</h5>
            </el-collapse-item>
            <el-collapse-item name="2" title="关于CMS与本站所关联密钥安全性">
              <div>
                密钥仅支持CMS后台录入
              </div>
            </el-collapse-item>
            <el-collapse-item name="3" title="项目属性从何而来">
              <div>
                由产品线决定,当然我们也能自主的为产品线另起别名达到统一的标识风格便于管理
              </div>
            </el-collapse-item>
            <el-collapse-item name="4" title="了解更多知识点">
              <div>
                <el-link class="zhishi" href="https://cngongbao.yuque.com/nav19m/llz5sz/aflb19">零代码搭建Jenkins自动化构建
                </el-link>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-card>
    </el-col>
  </el-row>


</template>

<style>
.zhishi {
  font-size: var(--el-font-size-extra-small);
}
</style>

<script>
import httpClient from "@/utils/request";
import common from "@/views/common/HttprequestUrl";

export default {
  data() {
    return {
      routingUrl: common,
      // projectUrl: common.assets.project,
      // collectionUrl: common.assets.collection,
      activeName: "",
      create: "创建",
      loading: false,
      // 密钥access_Key带搜索
      access_KeyOptions: [
        {
          value: '选项1',
          label: 'aliyun.akid（已经加密)',
        },
        {
          value: '选项2',
          label: 'aliyun.akxxxx（已经加密)',
        },
      ],
      // 数据表单
      form: {
        domain_name: '',
        project: '',
        vendor_name: '',
        access_key_id: '',
        access_Key: '',
      },
      projectData: [],
      rules: {
        domain_name: [
          {required: true, message: '请选择域名地址', trigger: 'blur'},
          {min: 3, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        project: [
          {required: true, message: '请选择项目属性', trigger: 'change'}
        ],
        vendor_name: [
          {required: true, message: '请选择云厂商,目前仅适配阿里云', trigger: 'change'}
        ],
        access_key_id: [
          {required: true, message: '请选择云厂商账户访问权限', trigger: 'change'}
        ],
        access_Key: [
          {required: true, message: '请选择云厂商账户访问权限', trigger: 'change'}
        ],
      },
      // 可用区预览
      vendor_nameRegionList: [
        {
          date: '华北 1',
          name: '青岛',
          address: 'cn-qingdao',
        },
        {
          date: '华北 2',
          name: '北京',
          address: 'cn-beijing',
        },
        {
          date: '华北 3',
          name: '张家口',
          address: 'cn-zhangjiakou',
        },
        {
          date: '华北 5',
          name: '呼和浩特',
          address: 'cn-huhehaote',
        },
        {
          date: '华东 1',
          name: '杭州',
          address: 'cn-hangzhou',
        },
        {
          date: '华东 2',
          name: '上海',
          address: 'cn-shanghai',
        },
        {
          date: '华南 1',
          name: '深圳',
          address: 'cn-shenzhen',
        },
        {
          date: '华南 3',
          name: '广州',
          address: 'cn-guangzhou',
        },
        {
          date: '西南 1',
          name: '成都',
          address: 'cn-chengdu',
        },
        {
          date: '华东 5',
          name: '南京（属于本地地域，邀测中）',
          address: 'cn-nanjing',
        },
      ]
    }
  },
  methods: {
    // 获取项目信息
    getAssetsProject() {
      httpClient.get(this.routingUrl.assets.project).then(res => {
        var data = res.results
        let i;
        for (i in data) {
          this.projectData.push(data[i].project_name)
        }
      }).catch(res => {
        console.log(res)
        this.$message.error({
          message: "项目信息获取失败"
        })
      })
    },
    // 密钥信息
    getCollectionList() {
      httpClient.get(this.routingUrl.assets.collection).then(res => {
        this.access_KeyOptions = res.results
      }).catch(res => {
        console.log(res)
        this.$message.error({
          message: "项目信息获取失败"
        })
      })
    },
    // 创建域名信息
    createDomain() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // alert('submit!');
          this.loading = true
          this.create = "正在验证"
          console.log(JSON.stringify(this.form))

          httpClient.post(this.routingUrl.createDomain, this.form).then(res => {
            console.log(res)
            if (res.code === 201) {
              console.log(res.results)
              this.$router.push({
                path: "/domain",
              })
            } else {
              this.$message.error({message: "Paas平台验证失败,刷新页面重新尝试!", duration: 0})
              this.$notify.error({
                message: "确保Paas服务正常运行中、以及检查云厂商密钥ID是否填写正确,并在所属权限指定的账户下,或者通过控制台查看详细的错误代码",
                duration: 0,
                title: "创建托管失败"
              })
            }
          }).catch(res => {
            this.$message.error({message: res})
            this.$notify.error({
              message: "域名已被托管或不支持托管",
              duration: 0,
              title: "创建托管失败"
            })
          })
        }
      });
    },
    // 返回域名列表主页
    returnDomainList() {
      this.$router.push({
        path: "/domain",
      })
    },
  },
  mounted: function () {
    this.getAssetsProject()
    this.getCollectionList()
  },

}
</script>
