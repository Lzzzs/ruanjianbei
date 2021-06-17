<template>
  <el-tooltip class="item" effect="dark" :content="text" placement="bottom">
    <svg class="icon" aria-hidden="true">
      <use :xlink:href="iconName"></use>
    </svg>
  </el-tooltip>
</template>

<script>
export default {
  data() {
    return {
      text: "",
    };
  },
  props: {
    iconName: {
      type: String,
      default: "",
    },
  },
  mounted() {
    switch (this.iconName) {
      case "#icon-zu":
        this.text = "数据表";
        break;
      case "#icon-zhuxingtu":
        this.text = "柱形图";
        break;
      case "#icon-zhexiantu":
        this.text = "折线图";
        break;
      case "#icon-mianjitu":
        this.text = "面积图";
        break;
      case "#icon-bingtu":
        this.text = "饼图";
        break;
      case "#icon-duoxiliesandiantu":
        this.text = "散点图";
        break;
      default:
        this.text = "图表";
        break;
    }
  },
};
</script>

<style scoped>
svg {
  width: 25px;
  height: 25px;
  margin-left: 15px;
  padding: 2px;
}
svg:hover {
  border: 1px solid #3f8ce8;
}
.active {
  box-shadow: 0px 1px 3px #98c3f8;
  border: 1px solid #3f8ce8;
}
</style>