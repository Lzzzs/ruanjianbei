<template>
  <div class="dash">
    <div class="header">
      <span class="title" @dblclick="updateTitleClick">{{ title }}</span>
      <div>
        <el-button size="mini" type="primary">编辑</el-button>
      </div>
    </div>
    <div id="main"></div>

    <!-- 重命名标题 -->
    <el-dialog title="重命名" :visible.sync="updateNameVisible" width="30%" :close-on-click-modal="false">
      <el-form :model="updateNameForm">
        <el-form-item label="仪表名称" label-width="80px">
          <el-input v-model="updateNameForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateNameVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateNameVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as echarts from "echarts/core";
import { TooltipComponent, GridComponent } from "echarts/components";
import { BarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([TooltipComponent, GridComponent, BarChart, CanvasRenderer]);
export default {
  data() {
    return {
      title: "组件123",
      updateNameVisible: false,
      updateNameForm: {
        name: "",
      },
      option: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: "1%",
          right: "1%",
          bottom: "2%",
          top: "11%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "直接访问",
            type: "bar",
            barWidth: "60%",
            data: [10, 52, 200, 334, 390, 330, 220],
          },
        ],
      },
    };
  },
  mounted() {
    var chartDom = document.getElementById("main");
    var myChart = echarts.init(chartDom);
    myChart.setOption(this.option);
  },
  methods: {
    updateTitleClick() {
      this.updateNameVisible = true;
    },
  },
};
</script>

<style scoped>
.dash {
  width: 707px;
  height: 45%;
  border: 1px solid #dcdfe6;
  padding: 5px 10px;
  margin-right: 40px;
  margin-bottom: 30px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #e4e7ed;
}
.header {
  display: flex;
  justify-content: space-between;
}
#main {
  width: 100%;
  height: 90%;
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