<template>
  <div id="bingtu"></div>
</template>

<script>
import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { PieChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);
export default {
  data() {
    return {
      options: {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
        },
        series: [
          {
            name: "访问来源",
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
            data: [
              { value: 1048, name: "搜索引擎" },
              { value: 735, name: "直接访问" },
              { value: 580, name: "邮件营销" },
              { value: 484, name: "联盟广告" },
              { value: 300, name: "视频广告" },
            ],
          },
        ],
      },
    };
  },
  mounted() {
    const myChart = echarts.init(document.getElementById("bingtu"));
    myChart.setOption(this.options);
  },
};
</script>

<style scoped>
#bingtu {
  width: 100%;
  height: 100%;
}
</style>