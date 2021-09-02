export const tuXingMixin = {
  data() {
    return {
      options: {
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: { readOnly: false },
            saveAsImage: {}
          },
          right: '9%'
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "2%",
          right: "9%",
          bottom: "4%",
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
            barWidth: "20%",
            data: [],
          },
        ],
      },
      tableName: "",
      writeData: {},
      Loading: false,
      isShowTip: true,
    };
  },
  mounted() {
    this.tableName = JSON.parse(decodeURIComponent(this.$route.query.dashInfo)).tableName;
    const { arr2, arr3 } = this.$store.state
    if (arr2.length > 0 || arr3.length > 0) {
      this.getData()
    }
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
      if (newValue.length > 1) {
        this.$message.warning("该图表暂时只支持x和y轴最多存放一个字段");
        this.$store.commit("setArr2", oldValue);
        return;
      }
      this.getData();
    },
    listenVuexArr3(newValue, oldValue) {
      if (newValue.length > 1) {
        this.$message.warning("该图表暂时只支持x和y轴最多存放一个字段");
        this.$store.commit("setArr3", oldValue);
        return;
      }
      this.getData();
    },
    writeData(newValue) {
      if (newValue != {}) {
        const { xdata, xfield, ydata, yfield } = newValue;

        this.options.xAxis[0].name = xfield;
        this.options.yAxis[0].name = yfield;
        if (xfield !== "" && yfield === "") {
          let arr = [];
          for (let i = 0; i < xdata.length; i++) {
            arr[i] = 1;
          }
          this.options.xAxis[0].data = xdata;
          this.options.yAxis[0].data = ydata;
          this.options.xAxis[0].type = "category";
          this.options.yAxis[0].type = "value";
          this.options.series[0].data = arr;
          this.options.series[0].name = xfield;
        }

        if (xfield === "" && yfield !== "") {
          let arr = [];
          for (let i = 0; i < ydata.length; i++) {
            arr[i] = 1;
          }
          this.options.xAxis[0].type = "value";
          this.options.xAxis[0].data = xdata;
          this.options.yAxis[0].data = ydata;
          this.options.yAxis[0].type = "category";
          this.options.series[0].data = arr;
          this.options.series[0].name = yfield;
        }
        // x, y 都为一个字段
        if (xfield !== "" && yfield !== "") {
          const xType = this.ruleFieldType(xfield);
          const yType = this.ruleFieldType(yfield);
          // x, y字段都为int
          if (xType === "int" && yType === "int") {
            this.options.xAxis[0].type = "category";
            this.options.xAxis[0].data = xdata;
            this.options.yAxis[0].data.length = 0;
            this.options.yAxis[0].type = "value";
            this.options.series[0].data = ydata;
            this.options.series[0].name = "";
          }
          // x, y字段都为varchar
          if (xType === "varchar" && yType === "varchar") {
            let arr = [];
            for (let i = 0; i < ydata.length; i++) {
              arr[i] = 10;
            }
            this.options.xAxis[0].type = "category";
            this.options.xAxis[0].data = xdata;
            this.options.yAxis[0].data = ydata;
            this.options.yAxis[0].type = "category";
            this.options.series[0].data = arr;
            this.options.series[0].name = "";
          }

          // x为varchar, y为int
          if (xType === "varchar" && yType === "int") {
            this.options.xAxis[0].type = "category";
            this.options.xAxis[0].data = xdata;
            this.options.yAxis[0].data.length = 0;
            this.options.yAxis[0].type = "value";
            this.options.series[0].data = ydata;
            this.options.series[0].name = "";
          }
          // x为int, y为varchar
          if (xType === "int" && yType === "varchar") {
            this.options.xAxis[0].type = "value";
            this.options.xAxis[0].data.length = 0;
            this.options.yAxis[0].data = ydata;
            this.options.yAxis[0].type = "category";
            this.options.series[0].data = xdata;
            this.options.series[0].name = "";
          }
        }
        this.wirteGraph()
        // 关闭动画
        this.Loading = false;
      }
    },
  },
  methods: {
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
}

// 仪表盘里面的图形
export const miniTuXingMixin = {
  data() {
    return {
      options: {
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            saveAsImage: {}
          },
          right: '2%'
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "1%",
          right: "16%",
          bottom: "2%",
          top: '3%',
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
            barWidth: "20%",
            data: [],
          },
        ],
      },
      writeData: {},
      Loading: false,
      isShowTip: true
    };
  },
  props: {
    createObj: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  mounted() {
    this.getData()
  },
  watch: {
    writeData(newValue) {
      if (newValue != {}) {
        const { xdata, xfield, ydata, yfield } = newValue;

        this.options.xAxis[0].name = xfield;
        this.options.yAxis[0].name = yfield;
        if (xfield !== "" && yfield === "") {
          let arr = [];
          for (let i = 0; i < xdata.length; i++) {
            arr[i] = 1;
          }
          this.options.xAxis[0].data = xdata;
          this.options.yAxis[0].data = ydata;
          this.options.xAxis[0].type = "category";
          this.options.yAxis[0].type = "value";
          this.options.series[0].data = arr;
          this.options.series[0].name = xfield;
        }

        if (xfield === "" && yfield !== "") {
          let arr = [];
          for (let i = 0; i < ydata.length; i++) {
            arr[i] = 1;
          }
          this.options.xAxis[0].type = "value";
          this.options.xAxis[0].data = xdata;
          this.options.yAxis[0].data = ydata;
          this.options.yAxis[0].type = "category";
          this.options.series[0].data = arr;
          this.options.series[0].name = yfield;
        }
        // x, y 都为一个字段
        if (xfield !== "" && yfield !== "") {
          const xType = this.ruleFieldType(xfield);
          const yType = this.ruleFieldType(yfield);
          // x, y字段都为int
          if (xType === "int" && yType === "int") {
            this.options.xAxis[0].type = "category";
            this.options.xAxis[0].data = xdata;
            this.options.yAxis[0].data.length = 0;
            this.options.yAxis[0].type = "value";
            this.options.series[0].data = ydata;
            this.options.series[0].name = "";
          }
          // x, y字段都为varchar
          if (xType === "varchar" && yType === "varchar") {
            let arr = [];
            for (let i = 0; i < ydata.length; i++) {
              arr[i] = 10;
            }
            this.options.xAxis[0].type = "category";
            this.options.xAxis[0].data = xdata;
            this.options.yAxis[0].data = ydata;
            this.options.yAxis[0].type = "category";
            this.options.series[0].data = arr;
            this.options.series[0].name = "";
          }

          // x为varchar, y为int
          if (xType === "varchar" && yType === "int") {
            this.options.xAxis[0].type = "category";
            this.options.xAxis[0].data = xdata;
            this.options.yAxis[0].data.length = 0;
            this.options.yAxis[0].type = "value";
            this.options.series[0].data = ydata;
            this.options.series[0].name = "";
          }
          // x为int, y为varchar
          if (xType === "int" && yType === "varchar") {
            this.options.xAxis[0].type = "value";
            this.options.xAxis[0].data.length = 0;
            this.options.yAxis[0].data = ydata;
            this.options.yAxis[0].type = "category";
            this.options.series[0].data = xdata;
            this.options.series[0].name = "";
          }
        }
        this.wirteGraph()
        // 关闭动画
        this.Loading = false;
      }
    },
  },
  methods: {
    // 验证字段类型
    ruleFieldType(fieldName) {
      const { xFileds, yFileds } = this.createObj
      // 合并arr2和arr3
      const arr = xFileds.concat(yFileds)
      for (let i of arr) {
        if (i.column_name === fieldName) {
          return i.data_type;
        }
      }
    },
  },
}