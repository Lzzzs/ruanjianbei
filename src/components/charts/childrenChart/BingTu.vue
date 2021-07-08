<template>
  <div style="height: 110%; width: 100%">
    <div id="bingtu" v-loading="Loading" v-show="!isShowTip"></div>
    <div class="tip" v-show="isShowTip">
      请拖入左侧字段至字段存放区, 将自动生成图形
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { PieChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);
import { createBingTu } from "@/service/admin/chartServer.js";
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
      tableName: "",
      writeData: {},
      Loading: false,
      isShowTip: true,
      oldArr1: [],
    };
  },
  mounted() {
    this.tableName = this.$route.query.tableName;
  },
  computed: {
    listenVuexArr1() {
      return this.$store.state.arr1;
    },
  },
  watch: {
    listenVuexArr1(newValue, oldValue) {
      this.oldArr1 = oldValue;
      let num = 0;
      newValue.map((item) => {
        if (item.data_type === "varchar") {
          num++;
        }
      });
      if (num > 1) {
        this.$message.warning(
          "饼图暂时只支持对一个字符字段进行分析,数字字段可以多个"
        );
        this.$store.commit("setArr1", oldValue);
      }
      this.getData();
    },
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
            if (item.data.length < 100) {
              for (const v of item.data) {
                this.options.series[0].data.push({
                  value: 1,
                  name: v,
                });
              }
            } else {
              this.$message.warning(
                "为保证流畅速度, 饼图暂不支持超过一百个字符的分析, 请重新选择字段"
              );
              this.$store.commit("setArr1", this.oldArr1);
              return;
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
      const tableName = this.tableName;
      const Fields = this.$store.state.arr1;
      const obj = {
        tableName,
        Fields,
      };
      createBingTu(obj)
        .then((res) => {
          console.log(res.data);
          if (res.data.error === undefined) {
            this.writeData = res.data;
          } else {
            console.log(123);
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
      const { tableFields } = this.$store.state;
      for (let i of tableFields) {
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