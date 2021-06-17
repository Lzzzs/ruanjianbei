<template>
  <el-header>
    <ul class="header-left">
      <li
        style="
          margin-right: 15px;
          font-weight: bold;
          font-size: 20px;
          font-family: Helvetica Neue;
        "
      >
        SuperCodeMonkey
      </li>
      <li>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          router
        >
          <el-menu-item index="/admin/index">首页</el-menu-item>
          <el-submenu index="2">
            <template slot="title">数据准备</template>
            <el-menu-item index="/admin/database">数据库</el-menu-item>
            <el-menu-item index="/admin/uploadcsv">上传csv</el-menu-item>
          </el-submenu>
          <el-menu-item index="/admin/charts">图表生成</el-menu-item>
        </el-menu>
      </li>
    </ul>
    <div class="header-right">个人中心</div>
  </el-header>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "/admin/index",
    };
  },
  methods: {
    handleSelect(key) {
      this.activeIndex = key
    },
  },
};
</script>

<style scoped>
.el-header {
  display: flex;
  justify-content: space-between;
  line-height: 60px;
  border-bottom: 1px solid rgb(230, 230, 230);
}
.header-left {
  display: flex;
}
</style>