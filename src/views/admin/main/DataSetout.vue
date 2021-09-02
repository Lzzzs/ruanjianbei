<template>
  <div>
    <div>
      <el-button class="button" @click="databaseform = true">
        连接数据库
      </el-button>
      <el-button class="button" @click="uploadcsvform = true">
        上传csv
      </el-button>
      <el-drawer
        :append-to-body="true"
        :visible.sync="databaseform"
        size="40%"
        :wrapperClosable="false"
        title="连接数据库"
      >
        <data-base class="upload" />
      </el-drawer>

      <el-drawer
        :append-to-body="true"
        :visible.sync="uploadcsvform"
        :wrapperClosable="false"
        size="40%"
        title="上传csv文件"
      >
        <upload-csv class="upload" />
      </el-drawer>
    </div>
  </div>
</template>

<script>
import DataBase from "./DataBase.vue";
import UploadCsv from "./UploadCsv.vue";
export default {
  data() {
    return {
      databaseform: false,
      uploadcsvform: false,
    };
  },
  components: {
    DataBase,
    UploadCsv,
  },
};
</script>
<style>
.button {
  /* 按钮大小 */
  margin: 40px;
  width: 45%;
  height: 500px;
  /* 文字大小,颜色 */
  font-size: 20px;
  color: black;
  /* 阴影边框 */
}
.button:hover {
  background: #f5f5f5;
}
.uploadbtn {
  margin-top: -20px;
  margin-left: 20px;
}
.upload {
  margin-top: -50px;
  margin-left: 10px;
}
</style>