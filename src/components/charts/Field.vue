<template>
  <div class="name" @dblclick="handelClick">
    <slot />
  </div>
</template> 

<script>
export default {
  methods: {
    handelClick() {
      // 判断组件点击两次事件
      this.$emit("doubleClick");
    },
  },
};
</script>

<style scoped>
.name {
  height: 22px;
  line-height: 22px;
  padding: 0px 5px;
  font-size: 12px;
  background-color: #ebf3fe;
  color: #3685f2;
  border-radius: 3px;
  margin-right: 10px;
  margin-bottom: 10px;
  /* 双击消失蓝色背景 */
  user-select: none;
}
.name:hover {
  cursor: pointer;
}
</style>