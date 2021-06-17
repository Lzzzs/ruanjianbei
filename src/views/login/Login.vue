<template>
  <div class="login">
    <div class="login-content">
      <h2>在线数据可视化分析平台</h2>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="s_name">
          <el-input
            type="text"
            v-model="ruleForm.s_name"
            autocomplete="off"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="s_pwd">
          <el-input
            type="password"
            v-model="ruleForm.s_pwd"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-top: 50px">
          <el-button type="primary" @click="submitForm()">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { isLogin } from "@/service/login/loginServer.js";

export default {
  name: "Login",
  data() {
    const checkUserName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };

    const checkPassWord = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };

    return {
      ruleForm: {
        s_name: "",
        s_pwd: "",
      },
      rules: {
        username: [{ validator: checkUserName, trigger: "blur" }],
        password: [{ validator: checkPassWord, trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 加载
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          // 发送登录请求
          isLogin(this.ruleForm).then((res) => {
            const { isLogin } = res.data;
            if (isLogin) {
              loading.close();
              this.$router.push("/admin");
            } else {
              loading.close();
              this.$message.error("用户名或者密码错误!")
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.login {
  height: 100%;
  width: 100%;
  background: url("../../assets/login.jpg") center center;
  background-size: cover;
}
.login-content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 38px 99px 38px 30px;
  background-color: rgb(255, 255, 255);
  border-radius: 20px;
  opacity: 0.8;
}
h2 {
  margin-bottom: 20px;
  margin-left: 62px;
  text-align: center;
}
</style>