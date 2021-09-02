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
      <!-- 创建数据表 -->
      <el-form-item label="创建表名" prop="name">
        <el-input
          v-model="ruleForm.name"
          placeholder="请输入数据表名"
          clearable
        ></el-input>
      </el-form-item>
      <!-- 字段名行 -->
      <el-form-item label="字段名行" prop="namenum">
        <el-input
          v-model="ruleForm.namenum"
          placeholder="请输入字段名行"
          clearable
        ></el-input>
      </el-form-item>
      <!-- 第一个数据行 -->
      <el-form-item label="第一个数据行" prop="fristdata">
        <el-input
          v-model="ruleForm.fristdata"
          placeholder="请输入第一个数据行"
          clearable
        ></el-input>
      </el-form-item>
      <!-- 最后一行数据行 -->
      <el-form-item label="最后一个数据行" prop="lastdata">
        <el-input
          v-model="ruleForm.listdata"
          placeholder="请输入最后一个数据行"
          clearable
        ></el-input>
      </el-form-item>
      <!-- 分隔符 -->
      <el-form-item label="分隔符" prop="symbol">
        <el-input
          v-model="ruleForm.symbol"
          placeholder="请输入最后一个数据行"
          clearable
        ></el-input>
      </el-form-item>
      <!-- 上传文件 -->
      <el-form-item label="上传文件" prop="wenjian">
        <el-upload
          style="margin-left: 14%; margin-top: 5%"
          class="avatar-uploader el-upload--text"
          drag
          action="http://127.0.0.1:8080/supercode_monkey/copyserver"
          multiple
          :show-file-list="false"
          :data="{ SavePath: this.Path.url }"
          :on-success="handleVideoSuccess"
          :before-upload="beforeUploadVideo"
          :on-progress="uploadVideoProcess"
        >
          <i v-if="Plus" class="el-icon-upload"></i>
          <div v-if="Plus" class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
          </div>
          <el-progress
            v-if="videoFlag == true"
            type="circle"
            :percentage="videoUploadPercent"
            style="margin-top: 30px"
          ></el-progress>
          <div class="el-upload__tip" slot="tip">只能上传csv/xlsx文件</div>
        </el-upload>
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm()">立即创建</el-button>
        <el-button @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        name: "",
        namenum: "",
        fristdata: "",
        lastdata: "",
        symbol: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入创建表名", trigger: "blur" },
          {
            min: 3,
            max: 50,
            message: "长度在 3 到 50 个字符",
            trigger: "blur",
          },
        ],
        namenum: [
          { required: true, message: "请输入字段名行", trigger: "blur" },
        ],
        fristdata: [
          { required: true, message: "请输入第一行数据行", trigger: "blur" },
        ],
        lastdata: [
          { required: true, message: "请输入最后一行数据行", trigger: "blur" },
        ],
        symbol: [{ required: true, message: "请输入分隔符", trigger: "blur" }],
        wenjian: [{ trigger: "blur" }],
      },
      videoForm: {
        videoId: "",
        videoUrl: "",
      },
      videoFlag: false,
      Plus: true,
      Path: {
        url: "D:/",
      },
      videoUploadPercent: 0,
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 视频上传前执行
    beforeUploadVideo(file) {
      if (
        [
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ].indexOf(file.type) === -1
      ) {
        console.log(file.type);
        this.$message.error("请上传正确的文件格式");
        return false;
      }
    },
    // 视频上传过程中执行
    uploadVideoProcess(event, file, fileList) {
      console.log("文件正在上传中1");
      this.Plus = false;
      console.log("文件正在上传中2");
      this.videoFlag = true;
      console.log("文件正在上传中3");
      this.videoUploadPercent = this.videoUploadPercent.percentage;
    },
    // 视频上传成功是执行
    handleVideoSuccess(res, file) {
      console.log("上传成功");
      this.Plus = false;
      this.videoUploadPercent = 100;
      console.log(res);
      // 如果为200代表视频保存成功
      if (res.resCode === "200") {
        // 接收视频传回来的名称和保存地址
        // 至于怎么使用看你啦~
        this.videoForm.videoId = res.newVidoeName;
        this.videoForm.videoUrl = res.VideoUrl;
        this.$message.success("文件上传成功！");
      } else {
        this.$message.error("文件上传失败，请重新上传！");
      }
    },
  },
};
</script>

<style>
</style>