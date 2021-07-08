<template>
  <div style="width: 100%; height: 100%">
    <shu-ju-biao v-if="chart === 0" class="chart" ref="shujubiao"></shu-ju-biao>
    <bing-tu v-if="chart === 1" class="chart" ref="bingtu"></bing-tu>
    <zhu-xing-tu v-if="chart === 2" class="chart" ref="zhuxingtu"></zhu-xing-tu>
    <zhe-xian-tu v-if="chart === 3" class="chart" ref="zhexiantu"></zhe-xian-tu>
    <mian-ji-tu v-if="chart === 4" class="chart" ref="mianjitu"></mian-ji-tu>
    <san-dian-tu v-if="chart === 5" class="chart" ref="sandiantu"></san-dian-tu>
  </div>
</template>

<script>
import ShuJuBiao from "./childrenChart/ShuJuBiao.vue";
import ZheXianTu from "./childrenChart/ZheXianTu.vue";
import ZhuXingTu from "./childrenChart/ZhuXingTu.vue";
import MianJiTu from "./childrenChart/MianJiTu.vue";
import BingTu from "./childrenChart/BingTu.vue";
import SanDianTu from "./childrenChart/SanDianTu.vue";

export default {
  components: { ShuJuBiao, ZhuXingTu, ZheXianTu, MianJiTu, BingTu, SanDianTu },
  props: {
    chart: {
      type: Number,
      default: 0,
    },
    loadChart: {
      type: String,
      default: "",
    },
  },
  watch: {
    chart(index) {
      switch (index) {
        case 0:
          this.$message("当前图表为数据表");
          return;
        case 1:
          this.$message("当前图表为饼图");
          return;
        case 2:
          this.$message("当前图表为柱形图");
          return;
        case 3:
          this.$message("当前图表为折线图");
          return;
        case 4:
          this.$message("当前图表为面积图");
          return;
        case 5:
          this.$message("当前图表为散点图");
          return;
      }
    },
    loadChart(name) {
      switch (name) {
        case "shujubiao":
          this.$nextTick(() => {
            this.$refs.shujubiao.getData();
          });
          break;
        case "bingtu":
          this.$nextTick(() => {
            this.$refs.bingtu.getData();
          });
          break;
        case "zhuxingtu":
          this.$nextTick(() => {
            this.$refs.zhuxingtu.getData();
          });
          break;
        case "zhexiantu":
          this.$nextTick(() => {
            this.$refs.zhexiantu.getData();
          });
          break;
        case "mianjitu":
          this.$nextTick(() => {
            this.$refs.mianjitu.getData();
          });
          break;
        case "sandiantu":
          this.$nextTick(() => {
            this.$refs.sandiantu.getData();
          });
          break;
      }
    },
  },
};
</script>

<style scoped>
.chart {
  height: 100%;
  width: 100%;
  background-color: #fff;
}
</style>