<template>
  <div style="width: 100%; height: 100%">
    <shu-ju-biao v-if="chart === 0" class="chart"></shu-ju-biao>
    <zhu-xing-tu
      v-if="chart === 1"
      class="chart"
      v-loading="loading1"
      @loading="loading1Method"
    ></zhu-xing-tu>
    <zhe-xian-tu v-if="chart === 2" class="chart"></zhe-xian-tu>
    <mian-ji-tu v-if="chart === 3" class="chart"></mian-ji-tu>
    <bing-tu v-if="chart === 4" class="chart"></bing-tu>
    <san-dian-tu v-if="chart === 5" class="chart"></san-dian-tu>
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
  data() {
    return {
      loading1: false,
    };
  },
  components: { ShuJuBiao, ZhuXingTu, ZheXianTu, MianJiTu, BingTu, SanDianTu },
  props: {
    chart: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    loading1Method(isOpen) {
      this.loading1 = isOpen;
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