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
          <el-menu-item index="/admin/dashboard">仪表盘</el-menu-item>
          <el-menu-item index="/admin/dataSetout">数据准备</el-menu-item>
          <el-menu-item index="/admin/charts">图表生成</el-menu-item>
        </el-menu>
      </li>
    </ul>
    <div class="header-right">
      <el-dropdown size="small" trigger="click">
        <span class="el-dropdown-link">
          admin<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown" size="small">
          <el-dropdown-item @click.native="loginOut">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "/admin/dashboard",
    };
  },
  methods: {
    handleSelect(key) {
      this.activeIndex = key;
    },
    loginOut() {
      // 退出
      this.$router.replace('/')
    }
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
.el-dropdown-link {
  cursor: pointer;
  color: #303133;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>