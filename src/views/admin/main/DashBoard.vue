<template>
  <div class="content">
    <div class="header">
      <div>
        <el-dropdown>
          <span class="el-dropdown-link">
            仪表盘列表<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu v-if="empty">
            <el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  size="small"
                  type="primary"
                  @click="addDashBoard"
                  :disabled="isLoading"
                  >添加仪表盘</el-button
                >
              </el-dropdown-item>
            </el-dropdown-item>
            <el-dropdown-item disabled>空</el-dropdown-item>
          </el-dropdown-menu>
          <el-dropdown-menu slot="dropdown" v-else>
            <el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  size="small"
                  type="primary"
                  @click="addDashBoard"
                  :disabled="isLoading"
                  >添加仪表盘</el-button
                >
              </el-dropdown-item>
            </el-dropdown-item>
            <el-dropdown-item
              v-for="item in dashboardData"
              :key="item"
              @click.native="handleClick(item)"
              :disabled="isLoading"
              >{{ item }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <span
          style="margin-left: 20px; font-size: 14px; color: #606266"
          v-show="!empty"
          >目前仪表盘为:
          <span style="color: #f56c6c"> {{ dashboardName }}</span></span
        >
      </div>

      <el-button
        size="small"
        type="primary"
        :disabled="isLoading"
        @click="addComponent"
      >
        添加组件
      </el-button>
    </div>

    <!-- 仪表盘内容部分 -->
    <router-view @loading="loading" @endLoading="endLoading"></router-view>

    <!-- 添加仪表盘 -->
    <el-dialog
      title="添加仪表盘"
      :visible.sync="addDashBoardVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form :model="addDashBoardForm">
        <el-form-item label="仪表盘名称" label-width="90px">
          <el-input
            v-model="addDashBoardForm.dashBoardName"
            autocomplete="off"
            placeholder="请输入仪表盘的名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDashBoardVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDashBoardVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 添加组件 -->
    <el-dialog
      title="添加组件"
      :visible.sync="addComponentVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form :model="addComponentForm">
        <el-form-item label-width="90px" label="仪表盘">
          <el-select
            v-model="addComponentForm.dashBoardName"
            placeholder="请选择仪表盘"
          >
            <el-option
              v-for="item in dashboardData"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组件名称" label-width="90px">
          <el-input
            v-model="addComponentForm.componentName"
            autocomplete="off"
            placeholder="请输入组件的名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addComponentVisible = false">取 消</el-button>
        <el-button type="primary" @click="addComponentVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dashboardData: ["one", "two", "123"],
      addDashBoardVisible: false,
      addComponentVisible: false,
      addDashBoardForm: {
        dashBoardName: "",
      },
      addComponentForm: {
        componentName: "",
        dashBoardName: "",
      },
      isLoading: false,
    };
  },
  computed: {
    empty() {
      return this.dashboardData.length === 0;
    },
    dashboardName: {
      get() {
        return this.$route.params.dashboardName;
      },
      set() {},
    },
  },
  methods: {
    handleClick(name) {
      this.dashboardName = name;
      this.$router.push(`/admin/dashboard/${name}`);
    },
    addDashBoard() {
      this.addDashBoardVisible = true;
    },
    addComponent() {
      this.addComponentVisible = true;
    },
    loading() {
      this.isLoading = true;
    },
    endLoading() {
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>
.content {
  height: 100%;
  padding: 5px 15px;
}
.header {
  display: flex;
  justify-content: space-between;
}
.el-dropdown-link {
  cursor: pointer;
  color: #303133;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.el-dropdown-menu__item {
  text-align: center;
  padding: 0 10px;
}
</style>