<template>
  <div style="width: 100%; height: 90%">
    <shu-ju-biao
      v-if="chart === 0"
      class="chart"
      ref="shujubiao"
      :createObj="createObj"
    ></shu-ju-biao>
    <bing-tu
      v-if="chart === 1"
      class="chart"
      ref="bingtu"
      :createObj="createObj"
    ></bing-tu>
    <zhu-xing-tu
      v-if="chart === 2"
      class="chart"
      ref="zhuxingtu"
      :createObj="createObj"
    ></zhu-xing-tu>
    <zhe-xian-tu
      v-if="chart === 3"
      class="chart"
      ref="zhexiantu"
      :createObj="createObj"
    ></zhe-xian-tu>
    <mian-ji-tu
      v-if="chart === 4"
      class="chart"
      ref="mianjitu"
      :createObj="createObj"
    ></mian-ji-tu>
    <san-dian-tu
      v-if="chart === 5"
      class="chart"
      ref="sandiantu"
      :createObj="createObj"
    ></san-dian-tu>
  </div>
</template>

<script>
import ShuJuBiao from "./miniChart/ShuJuBiao.vue";
import ZheXianTu from "./miniChart/ZheXianTu.vue";
import ZhuXingTu from "./miniChart/ZhuXingTu.vue";
import MianJiTu from "./miniChart/MianJiTu.vue";
import BingTu from "./miniChart/BingTu.vue";
import SanDianTu from "./miniChart/SanDianTu.vue";

export default {
  components: { ShuJuBiao, ZhuXingTu, ZheXianTu, MianJiTu, BingTu, SanDianTu },
  props: {
    chart: {
      type: Number,
      default: 0,
    },
    createObj: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  mounted() {},
};
</script>

<style scoped>
.chart {
  height: 100%;
  width: 100%;
}
</style>
