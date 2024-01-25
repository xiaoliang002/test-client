<template>
  <div class="login">
    <el-card class="login-card">
      <template #header>
        <div class="login-card-header">
          <span>用户登录</span>
        </div>
      </template>
      <!--      ref 校验事件，model 绑定数据源 rules 绑定校验规则-->
      <el-form ref="loginData" :model="loginData" :rules="loginDataRules">
        <el-form-item prop="username">
          <el-input v-model.trim="loginData.username" clearable maxlength="32" placeholder="请输入账号"
                    prefix-icon="UserFilled"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model.trim="loginData.password" clearable maxlength="50" placeholder="请输入密码"
                    prefix-icon="Lock" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loginLoading" style="width: 100%;border-radius: 2px" type="primary"
                     @click="submitForm('form')">
            登 录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import common from "../common/HttprequestUrl";
import httpClient from "@/utils/request";

export default {
  data() {
    return {
      loginLoading: false,
      loginUrl: common.login, // 登入接口变量
      // 表单数据
      loginData: {
        username: '',
        password: ''
      },
      loginDataRules: {
        username: [
          {required: true, message: '请填写用户名', trigger: 'change',}
        ],
        password: [
          {required: true, message: '请填写密码', trigger: 'change',}
        ],
      }
    }
  },
  methods: {
    // 按钮默认可以加参数的，会把数据传递过来
    // $refs 是ref="loginData" 绑定的校验事件，通过他拿到校验结果
    submitForm(formName) {
      this.$refs['loginData'].validate((valid) => {
        if (valid) {
          // 用户已经填写了表单数据，拿到数据进行请求
          console.log(valid)
          // 如果校验成功了，请求下面的认证接口
          this.requestPostForm()
        } else {
          console.log('表单校验失败！');
          return false;
        }
      });
    },
    // 请求接口认证
    requestPostForm() {
      httpClient.post(this.loginUrl, this.loginData)
          .then(res => {
            // 登入验证
            if (res.access) {
              this.$message.success({message: "登入成功"});
              console.log(res.access)
              window.localStorage.setItem('token', res.access); //存储token
              window.localStorage.setItem('username', res.username); //存储username
              // 跳转仪表盘
              this.$router.push('/home')
            } else return this.$message.success({message: "登入失败!!"});

          })
          .catch(res => {
            console.log(res)
            this.$message.error({
              message: "登入失败！"
            })
          })
    }

  }
}
</script>

<style scoped>
.login {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #ffffff;
  background-size: 100%;
  background-image: url(" @/assets/img/login-bg.jpg");

}

.login-card {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgb(255, 255, 255);
  overflow: hidden;
}

.login-card-header {
  text-align: center;
}
</style>
