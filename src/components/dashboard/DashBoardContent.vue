<template>
  <div class="content" v-loading="loading" v-if="!isShowTip">
    <dash-item
      v-for="(item, index) in dashDataArr"
      :key="index"
      :info="item"
    ></dash-item>
  </div>
  <div v-else>
    <el-empty description="该仪表盘暂无仪表, 请添加仪表"></el-empty>
  </div>
</template>

<script>
import DashItem from "./DashItem.vue";
export default {
  data() {
    return {
      loading: false,
      dashDataArr: [
        {
          dashBoardName: "仪表盘名称",
          componentName: "组件名称",
          tableName: "sample",
          computerField: [],
          currentChart: 3,
          fields: {
            arr1: [],
            arr2: ["flt_nbr"],
            arr3: ["flt_rte_cd"],
          },
        },
        {
          dashBoardName: "仪表盘名称",
          componentName: "组件名称",
          tableName: "sample",
          computerField: [],
          currentChart: 2,
          fields: {
            arr1: [],
            arr2: ["flt_seg_arrv_hh"],
            arr3: ["cls_cd"],
          },
        },
      ],
      isShowTip: false,
    };
  },
  components: { DashItem },
  computed: {
    dashBoardName() {
      return this.$route.params.dashboardName;
    },
  },
  watch: {
    // 监听仪表盘选择的变化
    dashBoardName() {
      this.getData();
    },
    // dashDataArr(arr) {
    //   if (arr.length === 0) {
    //     this.isShowTip = true;
    //   } else {
    //     this.isShowTip = false;
    //   }
    // },
  },
  methods: {
    getData() {
      //   this.$emit("loading");
      this.loading = true;
      //   findDashBoardIdBindNameServer(this.$route.params.dashboardName).then(
      //     (res) => {
      //       findDashBoardChildServer(res.data.dash_id).then((res) => {
      //         this.dashDataArr = res.data;
      //         this.loading = false;
      //         this.$emit("endLoading");
      //       });
      //     }
      //   );
      // },
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
  },
};
</script>

<style scoped>
.content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 10px;
}
.content > .dash:nth-child(2n) {
  margin-right: 10px !important;
}
</style>
