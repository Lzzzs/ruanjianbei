<template>
  <div class="dash">
    <div class="header">
      <span class="title" @dblclick="updateTitleClick">{{ title }}</span>
      <div>
        <el-button size="mini" type="primary" @click="update">编辑</el-button>
      </div>
    </div>

    <chart-content :chart="1" :createObj="createObj"></chart-content>
  </div>
</template>

<script>
import ChartContent from "./ChartContent.vue";
export default {
  components: { ChartContent },
  data() {
    return {
      updateNameVisible: false,
      updateNameForm: {
        name: "",
      },
      rules1: {
        name: [{ required: true, message: "请输入仪表名称", trigger: "blur" }],
      },
      chooseDataVisible: false,
      tableNameArr: [],
      chooseDataForm: {
        tableName: "",
      },
      rules2: {
        tableName: [{ required: true, message: "请选择表", trigger: "blur" }],
      },
    };
  },
  props: {
    info: {
      type: Object,
      default: {},
    },
  },
  methods: {
    update() {
      this.$router.push({
        path: "/admin/createChart",
        query: {
          dashInfo: encodeURIComponent(JSON.stringify(this.info)), //这样转换才能在跳转之后拿到对象
        },
      });
    },
  },
};
</script>

<style scoped>
.dash {
  width: 48%;
  height: 273px;
  border: 1px solid #dcdfe6;
  padding: 5px 10px;
  margin-bottom: 30px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #e4e7ed;
}
.header {
  display: flex;
  justify-content: space-between;
}
.title {
  font-size: 14px;
  color: #303133;
  user-select: none;
}
.title:hover {
  cursor: pointer;
}
</style>
