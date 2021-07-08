<template>
  <div class="content" v-loading="loading">
    <!-- {{dashBoardName}} -->
    <dash-item></dash-item>
    <dash-item></dash-item>
    <dash-item></dash-item>
    <dash-item></dash-item>
    <dash-item></dash-item>
  </div>
</template>

<script>
import DashItem from "./DashItem.vue";
export default {
  data() {
    return {
      loading: false,
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
    dashBoardName(newValue) {
      console.log(newValue);
      this.$emit("loading");
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.$emit("endLoading");
      }, 2000);
    },
  },
};
</script>

<style scoped>
.content {
  height: 95%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}
.content > .dash:nth-child(2n) {
  margin-right: 10px !important;
}
</style>