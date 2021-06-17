<template>
  <div id="zhexiantu"></div>
</template>

<script>
import * as echarts from "echarts/core";
import { TooltipComponent, GridComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([TooltipComponent, GridComponent, LineChart, CanvasRenderer]);

export default {
  data() {
    return {
      options: {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        tooltip: {
          trigger: "axis",
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line",
          },
        ],
      },
    };
  },
  computed: {
    listenVuexArr2() {
      return this.$store.state.arr2
    },
    listenVuexArr3() {
      return this.$store.state.arr3
    }
  },
  watch: {
    listenVuexArr2() {
      console.log(1);
    },
    listenVuexArr3() {
    }
  },
  mounted() {
    const myChart = echarts.init(document.getElementById("zhexiantu"));
    myChart.setOption(this.options);
  },
};
</script>

<style scoped>
#zhexiantu {
  width: 100%;
  height: 100%;
}
</style>