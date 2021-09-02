<template>
  <div style="height: 100%; width: 100%">
    <div id="bingtu" v-loading="Loading" v-show="!isShowTip"></div>
    <div class="tip" v-show="isShowTip">
      仪表暂无图表,请点击编辑进行绘制图表
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { PieChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { ToolboxComponent } from "echarts/components";
echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  ToolboxComponent,
]);
import { createBingTu } from "@/service/admin/chartServer.js";
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
            dataView: { readOnly: false },
            saveAsImage: {},
          },
          right: "9%",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "8%",
          left: "center",
        },
        series: [
          {
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "40",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [],
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
  watch: {
    writeData(newValue) {
      if (newValue != {}) {
        const { data } = newValue;
        this.options.series[0].data = [];
        // 构造options
        data.map((item) => {
          if (this.ruleFieldType(item.name[0]) === "int") {
            this.options.series[0].data.push({
              value: item.data[0],
              name: item.name[0],
            });
          } else {
            for (const v of item.data) {
              this.options.series[0].data.push({
                value: 1,
                name: v,
              });
            }
          }
        });
        const myChart = echarts.init(document.getElementById("bingtu"));
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
      createBingTu(this.createObj)
        .then((res) => {
          if (res.data.error === undefined) {
            this.writeData = res.data;
          } else {
            // 开启提示
            this.isShowTip = true;
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
      for (let i of this.createObj.Fields) {
        if (i.column_name === fieldName) {
          return i.data_type;
        }
      }
    },
  },
};
</script>

<style scoped>
#bingtu {
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