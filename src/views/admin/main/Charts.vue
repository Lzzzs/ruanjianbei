<template>
  <el-container style="height: 100%">
    <el-aside width="220px">
      <ul class="table">
        <li
          v-for="(item, index) in list"
          :key="index"
          @click="tableClick(item.tablename, index)"
          :class="currentIndex === index ? 'active' : ''"
        >
          {{ item.tablename }}
        </li>
      </ul>
    </el-aside>
    <el-main style="padding: 0 10px">
      <div v-if="$route.params.tableName" style="height: 97%">
        <div class="top">
          <h3>{{ $route.params.tableName }}</h3>
          <el-button type="primary" @click="createChart" :disabled="loading"
            >生成图表</el-button
          >
        </div>
        <!-- 展示表格 -->
        <el-table
          :data="tableData"
          stripe
          height="83%"
          style="width: 100%"
          border
          v-loading="loading"
        >
          <el-table-column
            :prop="item"
            :label="item"
            v-for="item in tableField"
            :key="item"
            width="200"
          >
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="count"
        >
        </el-pagination>
      </div>
    </el-main>

    <!-- 添加组件 -->
    <el-dialog
      title="添加组件"
      :visible.sync="addComponentVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form :model="addComponentForm" :rules="rules" ref="addComponent">
        <el-form-item label-width="90px" label="仪表盘" prop="dashBoardId">
          <el-select
            v-model="addComponentForm.dashBoardId"
            placeholder="请选择仪表盘"
          >
            <el-option
              v-for="item in dashboardData"
              :key="item.dash_id"
              :label="item.dash_name"
              :value="item.dash_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组件名称" label-width="90px" prop="componentName">
          <el-input
            v-model="addComponentForm.componentName"
            autocomplete="off"
            placeholder="请输入组件的名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addComponentVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddComponent">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import { getTableName, getTableData } from "@/service/admin/chartServer.js";
import { findAllDashBoardsServer } from "@/service/admin/dashBoardServer.js";
export default {
  data() {
    return {
      currentIndex: "",
      list: [],
      tableData: [],
      tableField: [], //表头字段
      tableName: "",
      currentPage: 1,
      currentLimit: 100,
      count: 0,
      loading: false,
      dashboardData: [],
      addComponentForm: {
        componentName: "",
        dashBoardId: "",
      },
      addComponentVisible: false,
      rules: {
        dashBoardId: [
          { required: true, message: "请选择仪表盘", trigger: "blur" },
        ],
        componentName: [
          { required: true, message: "请输入组件名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    const loading = this.$loading({
      lock: true,
      text: "Loading",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
    // 获取表名
    getTableName()
      .then((res) => {
        loading.close();
        this.list = res.data;
      })
      .catch(() => {
        loading.close();
        this.$message.error("请求超时");
      });
    this.getDashBoardData();
  },
  methods: {
    getData() {
      // 加载动画
      this.loading = true;
      // 请求数据
      getTableData({
        page: this.currentPage,
        limit: this.currentLimit,
        tableName: this.tableName,
      })
        .then((res) => {
          const { count, data } = res.data;
          this.count = count;
          this.tableData = data;
          // 将字段取出
          this.tableField = Object.keys(res.data.data[0]);
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          this.$message.error("请求超时");
        });
    },
    getDashBoardData() {
      findAllDashBoardsServer()
        .then((res) => {
          this.dashboardData = res.data;
        })
        .catch(() => {
          this.$message.error("请求超时");
        });
    },
    tableClick(name, index) {
      if (this.currentIndex != index || this.currentIndex == "") {
        this.currentIndex = index;
        this.tableName = name;
        this.getData(); //请求数据
        this.$router.push(`/admin/charts/${name}`);
      }
    },
    handleSizeChange(val) {
      // 每页条数
      this.currentLimit = val;
    },
    handleCurrentChange(val) {
      // 第几页
      this.currentPage = val;
    },
    createChart() {
      this.addComponentVisible = true;
    },
    confirmAddComponent() {
      this.$refs.addComponent.validate((vaild) => {
        if (vaild) {
          const dashInfo = {
            meter_id: [],
            dashBoardID: [],
            componentName: [],
            tablename: [],
            name: [],
            contentArr: [],
            currentchart: 0,
            file: [], // 对应数据表和饼图的字段数组
            filex: [], // 对应其他图表的x轴
            filey: [], // 对应其他图表的y轴
          };
          const { componentName, dashBoardId } = this.addComponentForm;
          dashInfo.dashBoardID[0] = dashBoardId;
          dashInfo.componentName[0] = componentName;
          if (!this.tableName) {
            this.$message.error("请选择表数据");
            return false;
          }
          dashInfo.tablename[0] = this.tableName;
          this.$router.push({
            path: "/admin/createChart",
            query: {
              dashInfo: encodeURIComponent(JSON.stringify(dashInfo)),
            },
          });
        } else {
          return false;
        }
      });
    },
  },
  watch: {
    currentPage() {
      this.getData();
    },
    currentLimit() {
      this.getData();
    },
  },
};
</script>

<style scoped>
.el-table {
  font-size: 12px;
}
.table {
  border-right: 1px solid #e6e6e6;
  height: 100%;
  background-color: #fffefe;
  padding-top: 13px;
}
.table li {
  text-align: center;
  padding: 5px 0;
  color: #909399;
}
.table li:hover {
  cursor: pointer;
  color: black;
}
.table li.active {
  color: black;
}
.el-pagination {
  text-align: center;
  padding-top: 20px;
}
.top {
  display: flex;
  justify-content: space-between;
  margin: 5px;
  line-height: 40px;
}
.top h3 {
  height: 40px;
}
</style>