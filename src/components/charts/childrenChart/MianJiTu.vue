<template>
  <div id="mianjitu"></div>
</template>

<script>
import * as echarts from "echarts/core";
import { GridComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([GridComponent, LineChart, CanvasRenderer]);
export default {
  data() {
    return {
      options: {
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        tooltip: {
          trigger: "axis",
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line",
            areaStyle: {},
          },
        ],
      },
    };
  },
  mounted() {
    const myChart = echarts.init(document.getElementById("mianjitu"));
    myChart.setOption(this.options);
  },
};
</script>

<style scoped>
#mianjitu {
  width: 100%;
  height: 100%;
}
</style>