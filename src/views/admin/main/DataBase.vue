<template>
  <div>
    <el-form
      style="width: 500px"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
      size="small"
    >
      <!-- 驱动 -->
      <el-form-item label="驱动" prop="drive">
        <el-input
          v-model="ruleForm.drive"
          autocomplete="off"
          placeholder="请输入驱动"
          clearable
        ></el-input>
      </el-form-item>

      <!-- 数据库地址 -->
      <el-form-item label="数据库地址" prop="url">
        <el-input
          v-model="ruleForm.url"
          autocomplete="off"
          placeholder="请输入数据库地址"
          clearable
        ></el-input>
      </el-form-item>

      <!-- 用户名 -->
      <el-form-item label="用户名" prop="user">
        <el-input
          v-model="ruleForm.user"
          autocomplete="off"
          placeholder="请输入数据库地址"
          clearable
        ></el-input>
      </el-form-item>

      <!-- 密码 -->
      <el-form-item label="密码" prop="pwd">
        <el-input
          type="password"
          autocomplete="off"
          v-model="ruleForm.pwd"
          placeholder="请输入密码"
          clearable
        ></el-input>
      </el-form-item>

      <!-- 按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm">立即连接</el-button>
        <el-button @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { connectDB } from "@/service/admin/dataChooseServer.js";

export default {
  data() {
    // 驱动
    const checkDrive = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入驱动"));
      } else {
        callback();
      }
    };
    // 地址
    const checkUrl = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入数据库地址"));
      } else {
        callback();
      }
    };
    // 用户名
    const checkUser = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    // 密码
    const checkPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };

    return {
      ruleForm: {
        driver: "",
        url: "",
        user: "",
        pwd: "",
      },
      rules: {
        driver: [{ validator: checkDrive, trigger: "blur" }],
        url: [{ validator: checkUrl, trigger: "blur" }],
        user: [{ validator: checkUser, trigger: "blur" }],
        pwd: [{ validator: checkPwd, trigger: "blur" }],
      },
    };
  },
  mounted() {
    connectDB({
      driver: "org.postgresql.Driver",
      url: "jdbc:postgresql://lzzzs.top:5432/postgres",
      user: "postgres",
      pwd: "admin"
    }).then(res => {
      console.log(res);
    })
  },
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 发送连接请求
          connectDB(this.ruleForm).then((res) => {
            console.log(res);
            const { upload } = res.data;
            if (upload) {
              console.log("正在验证");
              console.log(upload);
            } else {
              this.$message.error("用户名或者密码错误!");
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

<style>
</style>