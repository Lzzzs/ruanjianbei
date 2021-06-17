<template>
  <div id="zhuxingtu">12312312312313213</div>
</template>

<script>
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  CanvasRenderer,
]);
import { createZhuXingTu } from "@/service/admin/chartServer.js";
export default {
  data() {
    return {
      options: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "2%",
          right: "2%",
          bottom: "1%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisTick: {
              alignWithLabel: false,
            },
            name: "",
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "",
            data: [],
          },
        ],
        series: [
          {
            name: "",
            type: "bar",
            barWidth: "20%",
            data: [],
          },
        ],
      },
      tableName: "",
      writeData: {},
    };
  },
  mounted() {
    this.tableName = this.$route.query.tableName;
  },
  computed: {
    listenVuexArr2() {
      return this.$store.state.arr2;
    },
    listenVuexArr3() {
      return this.$store.state.arr3;
    },
  },
  watch: {
    listenVuexArr2(newValue, oldValue) {
      if (newValue.length > 2) {
        this.$message.warning("柱形图只支持x和y轴最多存放一个字段");
        this.$store.commit("setArr2", oldValue);
      }
      this.getData();
      // 关闭动画
      this.$emit("loading", false);
    },
    listenVuexArr3(newValue, oldValue) {
      if (newValue.length > 2) {
        this.$message.warning("柱形图只支持x和y轴最多存放一个字段");
        this.$store.commit("setArr3", oldValue);
      }
      this.getData();
      // 关闭动画
      this.$emit("loading", false);
    },
    writeData(newValue) {
      if (newValue != {}) {
        const { xdata, xfield, ydata, yfield } = newValue;
        this.options.xAxis[0].data = xdata;
        this.options.yAxis[0].data = ydata;
        this.options.xAxis[0].name = xfield;
        this.options.yAxis[0].name = yfield;
        if (xfield !== "" && yfield === "") {
          let arr = [];
          for (let i = 0; i < xdata.length; i++) {
            arr[i] = 1;
          }
          this.options.series[0].data = arr;
          this.options.series[0].name = xfield;
        }

        if (xfield === "" && yfield !== "") {
          let arr = [];
          for (let i = 0; i < ydata.length; i++) {
            arr[i] = 1;
          }
          this.options.xAxis[0].type = "value";
          this.options.yAxis[0].type = "category";
          this.options.series[0].data = arr;
          this.options.series[0].name = yfield;
        }

        console.log(newValue);
        if (xfield !== "" && yfield !== "") {
          this.options.xAxis[0].data = xdata;
          this.options.series[0].data = ydata;
        }

        const myChart = echarts.init(document.getElementById("zhuxingtu"));
        myChart.setOption(this.options);
        // 关闭动画
        this.$emit("loading", false);
      }
    },
  },
  methods: {
    getData() {
      // 加载动画
      this.$emit("loading", true);
      console.log(1);

      const tableName = this.tableName;
      const xFileds = this.$store.state.arr2.filter((item) => {
        // 过滤不需要的字段
        return item.column_name !== "请拖入左侧字段";
      });
      const yFileds = this.$store.state.arr3.filter((item) => {
        // 过滤不需要的字段
        return item.column_name !== "请拖入左侧字段";
      });
      const obj = {
        tableName,
        xFileds,
        yFileds,
      };
      createZhuXingTu(obj).then((res) => {
        this.writeData = res.data;
      });
    },
  },
};
</script>

<style scoped>
#zhuxingtu {
  width: 100%;
  height: 100%;
}
</style>