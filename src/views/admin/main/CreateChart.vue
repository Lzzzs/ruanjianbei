<template>
  <el-container style="height: 100%">
    <el-aside width="200px" style="height: 100%" id="create-chart-column">
      <h5>{{ $route.query.tableName }}</h5>
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
      <div style="display: flex; align-items: center">
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
      <!-- 图表存放字段区 -->
      <div class="chart-column">
        <chart-field
          :chart="currentChart"
          @rightToLeft="rightToLeft"
        ></chart-field>
      </div>
      <!-- 图表展示区 -->
      <div class="write-chart">
        <write-chart :chart="currentChart"></write-chart>
      </div>

      <!-- 提示框 -->
      <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
        <span>切换图表需要重新选择字段,之前字段会被清空,请问要继续吗?</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmToggleChart"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!-- 计算字段对话框 -->
      <computed-field :visible="computedDialog" @noticeChange="computedDialogChange"></computed-field>
    </el-main>
  </el-container>
</template>

<script>
import { getTableColumn } from "@/service/admin/chartServer.js";
import draggable from "vuedraggable";
import IconChart from "@/components/charts/IconChart.vue";
import ChartField from "@/components/charts/ChartField.vue";
import WriteChart from "@/components/charts/WriteChart.vue";
import FieldItem from "@/components/charts/FieldItem.vue";
import ComputedField from "@/components/charts/ComputedField.vue";

export default {
  data() {
    return {
      tableColumn: [],
      tableName: "",
      iconNames: [
        "#icon-zu",
        "#icon-zhuxingtu",
        "#icon-zhexiantu",
        "#icon-mianjitu",
        "#icon-bingtu",
        "#icon-duoxiliesandiantu",
      ],
      currentChart: 0,
      targetChart: 0,
      dialogVisible: false,
      computedDialog: false,
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
  mounted() {
    const loading = this.$loading({
      lock: true,
      text: "字段加载中...",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
    this.tableName = this.$route.query.tableName;
    getTableColumn(this.$route.query.tableName).then((res) => {
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
    });
  },
  watch: {
    // 监听数据变化 反映到vuex上
    tableColumn(newValue) {
      this.$store.commit("setTableFields", newValue);
    },
  },
  methods: {
    // 选择图表类型
    chooseChart(index) {
      this.targetChart = index;
      const { currentChart, targetChart } = this;
      const { arr1, arr2, arr3 } = this.$store.state;
      if (currentChart === 0 && targetChart > 0 && arr1.length > 1) {
        // 当前图表处于数据表, 并且用户已经选择了字段
        this.dialogVisible = true;
        return;
      }
      if (
        currentChart > 0 &&
        targetChart === 0 &&
        (arr2.length > 1 || arr3.length > 1)
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
      if (this.currentChart === 0) {
        // 现在图表是数据表, 则清除其他图表的数组
        commit("setArr2", [
          {
            column_name: "请拖入左侧字段",
          },
        ]);
        commit("setArr3", [
          {
            column_name: "请拖入左侧字段",
          },
        ]);
      } else {
        // 现在图表是其他图表, 则清除数据表的数组
        commit("setArr1", [
          {
            column_name: "请拖入左侧字段",
          },
        ]);
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
      if (this.currentChart === 0) {
        document.getElementsByClassName("shujubiao")[0].classList.add("active");
      } else {
        document.getElementsByClassName("x")[0].classList.add("active");
        document.getElementsByClassName("y")[0].classList.add("active");
      }
    },
    end() {
      // 结束时去掉样式
      if (this.currentChart === 0) {
        document
          .getElementsByClassName("shujubiao")[0]
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
      this.computedDialog = !this.computedDialog
    },
    computedDialogChange(visible) {
      this.computedDialog = visible
    }
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
.detail-text {
  font-size: 13px;
  padding: 10px;
  color: #3d4d66;
}
.write-chart {
  height: 80%;
  width: 100%;
}
/* 从左边拖到右边的样式 */
.ghost {
  display: flex;
  padding: 0px 10px;
  font-size: 13px;
  background-color: #e4edfa;
  border-radius: 20px;
  margin-left: 4px;
  height: 22px;
  line-height: 22px;
}
</style>