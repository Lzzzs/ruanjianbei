<template>
  <el-container style="height: 100%">
    <el-aside width="200px" style="height: 100%" id="create-chart-column">
      <div class="showTable">
        <h5>
          {{ tableName }}
        </h5>
        <el-dropdown size="mini" trigger="click">
          <el-button size="mini" type="text">
            切换数据源<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item, index) in tableNameArr"
              :key="index"
              @click.native="toggleData(item.tablename)"
              >{{ item.tablename }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-button
        round
        type="primary"
        size="mini"
        icon="el-icon-plus"
        style="margin: 5px 10px 8px"
        @click="computedFieldClick"
        >计算字段</el-button
      >
      <ul class="ul-column">
        <draggable
          v-model="tableColumn"
          :options="{ group: { name: 'lzs', pull: 'clone' }, sort: true }"
          animation="150"
          @start="start"
          @end="end"
          ghostClass="ghost"
        >
          <transition-group>
            <!-- 字段组件 -->
            <field-item
              v-for="(item, index) in tableColumn"
              :key="index"
              :tableFields="tableColumn"
              :currentIndex="index"
              @computedType="changeComputedType"
            >
              {{ item.column_name }}
            </field-item>
          </transition-group>
        </draggable>
      </ul>
    </el-aside>
    <el-main style="padding: 2px 8px; background-color: #f7f8fa">
      <div class="main-header">
        <div class="chart-icon">
          <div class="detail-text">图表类型</div>
          <div class="icons-group">
            <icon-chart
              v-for="(item, index) in iconNames"
              :key="index"
              :iconName="item"
              @click.native="chooseChart(index)"
              :class="currentChart === index ? 'active' : ''"
            ></icon-chart>
          </div>
        </div>
        <div>
          <el-button size="mini" type="primary" @click="saveDashInfo">
            保存到仪表盘
          </el-button>
        </div>
      </div>
      <!-- 图表存放字段区 -->
      <div class="chart-column">
        <chart-field
          :chart="currentChart"
          @rightToLeft="rightToLeft"
          ref="chartField"
        ></chart-field>
      </div>

      <!-- 图表展示区 -->
      <div class="write-chart">
        <write-chart
          :chart="currentChart"
          :loadChart="loadChartName"
        ></write-chart>
      </div>

      <!-- 提示框 -->
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        :close-on-click-modal="false"
      >
        <span>切换图表需要重新选择字段,之前字段会被清空,请问要继续吗?</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmToggleChart"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!-- 计算字段对话框 -->
      <computed-field
        :visible="computedDialog"
        @noticeChange="computedDialogChange"
      ></computed-field>
    </el-main>
  </el-container>
</template>

<script>
import { getTableColumn, getTableName } from "@/service/admin/chartServer.js";
import { updateDashServer } from "@/service/admin/dashBoardServer.js";
import draggable from "vuedraggable";
import IconChart from "@/components/charts/IconChart.vue";
import ChartField from "@/components/charts/ChartField.vue";
import WriteChart from "@/components/charts/WriteChart.vue";
import FieldItem from "@/components/charts/FieldItem.vue";
import ComputedField from "@/components/charts/ComputedField.vue";

export default {
  inject: ["reload"], //注入App里的reload方法
  data() {
    return {
      tableColumn: [],
      tableName: "",
      iconNames: [
        "#icon-zu",
        "#icon-bingtu",
        "#icon-zhuxingtu",
        "#icon-zhexiantu",
        "#icon-mianjitu",
        "#icon-duoxiliesandiantu",
      ],
      currentChart: 0,
      targetChart: 0,
      dialogVisible: false,
      computedDialog: false,
      loadChartName: "", //加载图表的名称
      tableNameArr: [], // 所有表名
      dashInfo: {},
    };
  },
  components: {
    draggable,
    IconChart,
    ChartField,
    WriteChart,
    FieldItem,
    ComputedField,
  },
  created() {
    getTableName().then((res) => {
      this.tableNameArr = res.data;
    });
  },
  mounted() {
    this.getData();
    this.dashInfo = JSON.parse(decodeURIComponent(this.$route.query.dashInfo));
    const { currentchart, fields } = this.dashInfo;
    const { arr1, arr2, arr3 } = fields;
    this.currentChart = Number(currentchart);
    this.$store.commit("setArr1", arr1);
    this.$store.commit("setArr2", arr2);
    this.$store.commit("setArr3", arr3);
  },
  watch: {
    // 监听数据变化 反映到vuex上
    tableColumn(newValue) {
      this.$store.commit("setTableFields", newValue);
    },
    currentChart(newChartIndex, oldChartIndex) {
      const { arr1, arr2, arr3 } = this.$store.state;
      if (newChartIndex === 0 && oldChartIndex === 1 && arr1.length > 0) {
        this.loadChartName = "shujubiao";
      }
      if (newChartIndex === 1 && oldChartIndex === 0 && arr1.length > 0) {
        this.loadChartName = "bingtu";
      }
      if (
        newChartIndex === 2 &&
        (oldChartIndex === 4 || oldChartIndex === 3 || oldChartIndex == 5) &&
        (arr2.length > 0 || arr3.length > 0)
      ) {
        this.loadChartName = "zhuxingtu";
      }
      if (
        newChartIndex === 3 &&
        (oldChartIndex === 2 || oldChartIndex === 4 || oldChartIndex == 5) &&
        (arr2.length > 0 || arr3.length > 0)
      ) {
        this.loadChartName = "zhexiantu";
      }
      if (
        newChartIndex === 4 &&
        (oldChartIndex === 3 || oldChartIndex === 2 || oldChartIndex == 5) &&
        (arr2.length > 0 || arr3.length > 0)
      ) {
        this.loadChartName = "mianjitu";
      }
      if (
        newChartIndex === 5 &&
        (oldChartIndex === 2 || oldChartIndex === 3 || oldChartIndex == 4) &&
        (arr2.length > 0 || arr3.length > 0)
      ) {
        this.loadChartName = "sandiantu";
      }
    },
  },
  methods: {
    getData() {
      const loading = this.$loading({
        lock: true,
        text: "字段加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      this.tableName = JSON.parse(
        decodeURIComponent(this.$route.query.dashInfo)
      ).tableName;
      getTableColumn(this.tableName)
        .then((res) => {
          const { data } = res;
          if (data.msg === "false") {
            this.$router.push("/admin/charts");
            this.$message.warning("请求的表不存在, 请检查!");
            return;
          }
          this.tableColumn = data;
          // 数字的默认类型是求和
          data.map((item) => {
            return item.data_type === "int"
              ? (item.type = "求和")
              : (item.type = "");
          });
          this.$store.commit("setTableFields", data);
          loading.close();
        })
        .catch(() => {
          loading.close();
          this.$message.error("请求超时");
        });
    },
    // 选择图表类型
    chooseChart(index) {
      this.targetChart = index;
      const { currentChart, targetChart } = this;
      const { arr1, arr2, arr3 } = this.$store.state;
      if (currentChart === 0 && targetChart != 1 && arr1.length > 0) {
        // 当前图表处于数据表, 并且用户已经选择了字段
        this.dialogVisible = true;
        return;
      }
      if (currentChart === 1 && targetChart != 0 && arr1.length > 0) {
        // 当前图表处于饼图, 并且用户已经选择了字段
        this.dialogVisible = true;
        return;
      }
      if (
        currentChart != 0 &&
        currentChart != 1 &&
        (targetChart === 0 || targetChart === 1) &&
        (arr2.length > 0 || arr3.length > 0)
      ) {
        // 当前图表处于其他图表, 并且用户已经选择了字段
        this.dialogVisible = true;
        return;
      }
      this.currentChart = this.targetChart;
    },
    // 确认切换图表
    confirmToggleChart() {
      // 关闭对话框
      this.dialogVisible = false;
      // 切换图表
      this.currentChart = this.targetChart;
      // 清除其他图表的字段
      const { commit } = this.$store;
      if (this.currentChart === 0 || this.currentChart === 1) {
        // 现在图表是数据表和饼图, 则清除其他图表的数组
        commit("setArr2", []);
        commit("setArr3", []);
      } else {
        // 现在图表是其他图表, 则清除数据表的数组
        commit("setArr1", []);
      }
    },
    // 右到左去重
    rightToLeft() {
      // 数组去重处理
      const items = this.tableColumn.filter((item, index, arr) => {
        return arr.indexOf(item, 0) === index;
      });
      this.tableColumn = items;
    },
    start() {
      // 刚开始拖拽高亮显示可拖拽区域
      if (this.currentChart === 0 || this.currentChart === 1) {
        document
          .getElementsByClassName("shujubiao_bingtu")[0]
          .classList.add("active");
      } else {
        document.getElementsByClassName("x")[0].classList.add("active");
        document.getElementsByClassName("y")[0].classList.add("active");
      }
    },
    end() {
      // 结束时去掉样式
      if (this.currentChart === 0 || this.currentChart === 1) {
        document
          .getElementsByClassName("shujubiao_bingtu")[0]
          .classList.remove("active");
      } else {
        document.getElementsByClassName("x")[0].classList.remove("active");
        document.getElementsByClassName("y")[0].classList.remove("active");
      }
    },
    // 改变字段的计算类型
    changeComputedType(obj) {
      const { type, index } = obj;
      this.tableColumn[index].type = type;
      this.$store.commit("setTableFields", this.tableColumn);
    },
    // 计算字段按钮点击
    computedFieldClick() {
      this.computedDialog = !this.computedDialog;
    },
    computedDialogChange(visible) {
      this.computedDialog = visible;
    },
    toggleData(tableName) {
      if (tableName != this.tableName) {
        this.$confirm("切换数据源会导致选择的数据消失, 要继续吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
          closeOnClickModal: false,
        })
          .then(() => {
            // 切换数据源初始化dashInfo
            this.dashInfo.tablename[0] = tableName;
            this.dashInfo.contentArr.length = 0;
            this.dashInfo.name.length = 0;
            this.dashInfo.currentchart[0] = 0;
            this.dashInfo.file.length = 0;
            this.dashInfo.filex.length = 0;
            this.dashInfo.filey.length = 0;
            this.$router.push({
              path: "/admin/createChart",
              query: {
                dashInfo: encodeURIComponent(JSON.stringify(this.dashInfo)), //这样转换才能在跳转之后拿到对象
              },
            });
            this.reload(); // 刷新页面
            this.$message.success("切换成功!");
          })
          .catch((err) => {
            this.$message.error("切换失败");
          });
      } else {
        this.$message.warning("不能重复选择数据源");
      }
    },
    // 保存仪表数据跳转到仪表盘
    saveDashInfo() {
      this.dashInfo.currentchart[0] = this.currentChart;
      const { arr1, arr2, arr3 } = this.$store.state;
      this.dashInfo.file = arr1;
      this.dashInfo.filex = arr2;
      this.dashInfo.filey = arr3;
      updateDashServer(this.dashInfo)
        .then((res) => {
          if (res.data) {
            this.$message.success("保存成功!");
            this.$router.push(`/admin/dashboard`);
          }
        })
        .catch(() => {
          this.$message.error("请求超时");
        });
    },
  },
};
</script>

<style scoped>
#create-chart-column {
  background-color: #f7f8fa;
  border-right: 1px solid #e8eaed;
}
#create-chart-column h5 {
  padding: 6px 10px;
}
#computed-btn {
  height: 20px;
  line-height: 20px;
}
.ul-column {
  border: 1px solid transparent;
  transition: border 0.15s ease-in-out;
}
.ul-column.active {
  border: 1px solid rgb(49, 139, 241);
}
.icons-group {
  display: flex;
  flex-wrap: wrap;
  padding: 5px 10px;
}
.chart-icon {
  display: flex;
  align-items: center;
}
.main-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.detail-text {
  font-size: 13px;
  padding: 10px;
  color: #3d4d66;
}
.write-chart {
  height: 80%;
  width: 100%;
}
.showTable {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
/* 从左边拖到右边的样式 */
.ghost {
  display: flex;
  width: 180px;
  align-items: center;
  padding: 0px 10px;
  font-size: 13px;
  background-color: #e4edfa;
  border-radius: 20px;
  margin-left: 4px;
}
</style>
