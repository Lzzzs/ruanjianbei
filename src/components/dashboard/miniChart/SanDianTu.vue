<template>
  <div>
    <div id="sandiantu" v-loading="Loading" v-show="!isShowTip"></div>
    <div class="tip" v-show="isShowTip">
      仪表暂无图表,请点击编辑进行绘制图表
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts/core";
import { GridComponent } from "echarts/components";
import { ScatterChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { ToolboxComponent } from "echarts/components";
echarts.use([GridComponent, ScatterChart, CanvasRenderer, ToolboxComponent]);
import { createSanDianTu } from "@/service/admin/chartServer.js";
export default {
  data() {
    return {
      options: {
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: "none",
            },
            saveAsImage: {},
          },
          right: "2%",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
        },
        grid: {
          left: "1%",
          right: "16%",
          bottom: "2%",
          top: "3%",
          containLabel: true,
        },
        xAxis: {
          name: "",
          type: "category",
          data: [],
        },
        yAxis: {
          name: "",
          type: "value",
          data: [],
        },
        series: [
          {
            data: [],
            type: "scatter",
          },
        ],
      },
      writeData: {},
      Loading: false,
      isShowTip: true,
    };
  },
  props: {
    createObj: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  mounted() {
    this.getData();
  },
  watch: {
    writeData(newValue) {
      if (newValue != {}) {
        const { xdata, xfield, ydata, yfield } = newValue;
        let { xAxis, yAxis, series } = this.options;
        // 初始化参数
        xAxis.name = xfield;
        yAxis.name = yfield;
        series[0].data = [];

        if (xfield !== "" && yfield === "") {
          const xType = this.ruleFieldType(xfield);
          if (xType === "int") {
            // int
            delete this.options.xAxis.data;
            delete this.options.yAxis.data;
            this.options.series[0].data[0] = [xdata[0], 1];
            this.options.xAxis.type = "value";
            this.options.yAxis.type = "value";
          } else {
            // varcahr
            delete this.options.yAxis.data;
            this.options.xAxis.data = xdata;
            this.options.xAxis.type = "category";
            this.options.yAxis.type = "value";
            for (let i = 0; i < xdata.length; i++) {
              this.options.series[0].data.push([i, 1]);
            }
          }
        }

        if (xfield === "" && yfield !== "") {
          const yType = this.ruleFieldType(yfield);
          if (yType === "int") {
            // int
            delete this.options.xAxis.data;
            delete this.options.yAxis.data;
            this.options.xAxis.type = "value";
            this.options.yAxis.type = "value";
            this.options.series[0].data[0] = [1, ydata[0]];
          } else {
            // varcahr
            delete this.options.xAxis.data;
            this.options.yAxis.data = ydata;
            this.options.xAxis.type = "value";
            this.options.yAxis.type = "category";
            for (let i = ydata.length; i > 0; i--) {
              this.options.series[0].data.push([1, i]);
            }
          }
        }

        // // x, y 都为一个字段
        if (xfield !== "" && yfield !== "") {
          const xType = this.ruleFieldType(xfield);
          const yType = this.ruleFieldType(yfield);
          // x, y字段都为int
          if (xType === "int" && yType === "int") {
            delete this.options.xAxis.data;
            delete this.options.yAxis.data;
            this.options.xAxis.type = "value";
            this.options.yAxis.type = "value";
            this.options.series[0].data[0] = [xdata[0], ydata[0]];
          }
          // x, y字段都为varchar
          if (xType === "varchar" && yType === "varchar") {
            this.options.xAxis.data = xdata;
            this.options.yAxis.data = ydata;
            this.options.xAxis.type = "category";
            this.options.yAxis.type = "category";
            for (let i = 0; i < xdata.length; i++) {
              this.options.series[0].data.push([i, 1]);
            }
          }

          // x为varchar, y为int
          if (xType === "varchar" && yType === "int") {
            delete this.options.yAxis.data;
            this.options.xAxis.data = xdata;
            this.options.xAxis.type = "category";
            this.options.yAxis.type = "value";
            for (let i = 0; i < xdata.length; i++) {
              this.options.series[0].data.push([i, ydata[i]]);
            }
          }
          // x为int, y为varchar
          if (xType === "int" && yType === "varchar") {
            delete this.options.xAxis.data;
            this.options.yAxis.data = ydata;
            this.options.xAxis.type = "value";
            this.options.yAxis.type = "category";
            for (let i = 0; i < xdata.length; i++) {
              this.options.series[0].data.push([xdata[i], i]);
            }
          }
        }
        const myChart = echarts.init(document.getElementById("sandiantu"));
        myChart.setOption(this.options);
        // 关闭动画
        this.Loading = false;
      }
    },
  },
  methods: {
    getData() {
      // 关闭提示
      this.isShowTip = false;
      // 加载动画
      this.Loading = true;
      createSanDianTu(this.createObj)
        .then((res) => {
          if (res.data.error === undefined) {
            this.writeData = res.data;
          } else {
            // 关闭提示
            this.isShowTip = false;
            // 关闭动画
            this.Loading = false;
          }
        })
        .catch(() => {
          this.Loading = false;
          this.$message.error("请求超时");
        });
    },
    // 验证字段类型
    ruleFieldType(fieldName) {
      const { xFileds, yFileds } = this.createObj;
      // 合并arr2和arr3
      const arr = xFileds.concat(yFileds);
      for (let i of arr) {
        if (i.column_name === fieldName) {
          return i.data_type;
        }
      }
    },
  },
};
</script>

<style scoped>
#sandiantu {
  width: 100%;
  height: 100%;
}
.tip {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #909399;
  font-size: 14px;
}
</style>