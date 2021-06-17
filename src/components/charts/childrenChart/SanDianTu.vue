<template>
  <div id="sandiantu"></div>
</template>

<script>
import * as echarts from "echarts/core";
import { GridComponent } from "echarts/components";
import { ScatterChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([GridComponent, ScatterChart, CanvasRenderer]);
export default {
  data() {
    return {
      options: {
        xAxis: {},
        yAxis: {},
        series: [
          {
            symbolSize: 20,
            data: [
              [10.0, 8.04],
              [8.07, 6.95],
              [13.0, 7.58],
              [9.05, 8.81],
              [11.0, 8.33],
              [14.0, 7.66],
              [13.4, 6.81],
              [10.0, 6.33],
              [14.0, 8.96],
              [12.5, 6.82],
              [9.15, 7.2],
              [11.5, 7.2],
              [3.03, 4.23],
              [12.2, 7.83],
              [2.02, 4.47],
              [1.05, 3.33],
              [4.05, 4.96],
              [6.03, 7.24],
              [12.0, 6.26],
              [12.0, 8.84],
              [7.08, 5.82],
              [5.02, 5.68],
            ],
            type: "scatter",
          },
        ],
      },
    };
  },
  mounted() {
    const myChart = echarts.init(document.getElementById("sandiantu"));
    myChart.setOption(this.options);
  },
};
</script>

<style scoped>
#sandiantu {
  width: 100%;
  height: 100%;
}
</style>