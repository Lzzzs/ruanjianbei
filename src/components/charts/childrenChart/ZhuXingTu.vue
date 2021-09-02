<template>
  <div>
    <div id="zhuxingtu" v-loading="Loading" v-show="!isShowTip"></div>
    <div class="tip" v-show="isShowTip">
      请拖入左侧字段至字段存放区, 将自动生成图形
    </div>
  </div>
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
import { ToolboxComponent } from "echarts/components";
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  CanvasRenderer,
  ToolboxComponent,
]);
import { createZhuXingTu } from "@/service/admin/chartServer.js";
import { tuXingMixin } from "@/lib/mixin.js";
export default {
  mixins: [tuXingMixin],
  methods: {
    getData() {
      // 关闭提示
      this.isShowTip = false;
      // 加载动画
      this.Loading = true;
      const tableName = this.tableName;
      const xFileds = this.$store.state.arr2;
      const yFileds = this.$store.state.arr3;
      const obj = {
        tableName,
        xFileds,
        yFileds,
      };
      createZhuXingTu(obj)
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
    wirteGraph() {
      this.options.series[0].type = "bar"; // 设置为柱形图
      const myChart = echarts.init(document.getElementById("zhuxingtu"));
      myChart.setOption(this.options);
    },
  },
};
</script>

<style scoped>
#zhuxingtu {
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