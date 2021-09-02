<template>
  <div class="content">
    <div class="header">
      <div>
        <el-dropdown>
          <span class="el-dropdown-link">
            仪表盘列表<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
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
        <el-button
          size="mini"
          style="margin-left: 20px"
          type="primary"
          @click="updateCurrentDashBoard"
          v-show="dashboardName"
          >修改该仪表盘</el-button
        >
        <el-popconfirm
          confirm-button-text="确定"
          cancel-button-text="不用了"
          icon="el-icon-info"
          icon-color="red"
          :title="deleteDashBoardText"
          @confirm="confirmDeleteDashBoard"
        >
          <el-button
            slot="reference"
            v-show="dashboardName"
            size="mini"
            type="primary"
            style="margin-left: 20px"
            >删除该仪表盘</el-button
          >
        </el-popconfirm>
      </div>
      <div class="header-two">
        <el-tooltip content="点击即可生成仪表盘图片" placement="bottom">
          <i class="el-icon-camera-solid screenshot" @click="screenshot"></i>
        </el-tooltip>
        <el-button
          size="small"
          type="primary"
          :disabled="isLoading"
          @click="addComponent"
        >
          添加组件
        </el-button>
      </div>
    </div>

    <div ref="content">
      <!-- 仪表盘内容部分 -->
      <router-view @loading="loading" @endLoading="endLoading"></router-view>
    </div>

    <!-- 添加仪表盘 -->
    <el-dialog
      title="添加仪表盘"
      :visible.sync="addDashBoardVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form :model="addDashBoardForm" :rules="rules1" ref="addDashBoard">
        <el-form-item
          label="仪表盘名称"
          label-width="95px"
          prop="dashBoardName"
        >
          <el-input
            v-model="addDashBoardForm.dashBoardName"
            autocomplete="off"
            placeholder="请输入仪表盘的名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDashBoardVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddDashBoard">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改仪表盘 -->
    <el-dialog
      title="修改仪表盘"
      :visible.sync="updateDashBoardVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form
        :model="updateDashBoardForm"
        :rules="rules3"
        ref="updateDashBoard"
      >
        <el-form-item
          label="仪表盘名称"
          label-width="95px"
          prop="dashBoardName"
        >
          <el-input
            v-model="updateDashBoardForm.dashBoardName"
            autocomplete="off"
            placeholder="请输入仪表盘的名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDashBoardVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmUpdateDashBoard"
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
      <el-form :model="addComponentForm" :rules="rules2" ref="addComponent">
        <el-form-item label-width="90px" label="仪表盘" prop="dashBoardId">
          <el-select
            v-model="addComponentForm.dashBoardId"
            placeholder="请选择仪表盘"
          >
            <el-option
              v-for="item in dashboardData"
              :key="item.dash_id"
              :label="item.dash_name"
              :value="item.dash_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组件名称" label-width="90px" prop="componentName">
          <el-input
            v-model="addComponentForm.componentName"
            autocomplete="off"
            placeholder="请输入组件的名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addComponentVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddComponent">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import {
  addDashBoardServer,
  updateDashBoardServer,
  deleteDashBoardServer,
  addDashServer,
} from "@/service/admin/dashBoardServer.js";
export default {
  data() {
    return {
      dashboardData: ["仪表盘1", "仪表盘2"],
      addDashBoardVisible: false,
      addComponentVisible: false,
      updateDashBoardVisible: false,
      dashboardId: "",
      dashboardName: "",
      addDashBoardForm: {
        dashBoardName: "",
      },
      rules1: {
        dashBoardName: [
          { required: true, message: "请输入仪表盘的名称", trigger: "blur" },
        ],
      },
      addComponentForm: {
        componentName: "",
        dashBoardId: "",
      },
      rules2: {
        dashBoardId: [
          { required: true, message: "请选择仪表盘", trigger: "blur" },
        ],
        componentName: [
          { required: true, message: "请输入组件名称", trigger: "blur" },
        ],
      },
      updateDashBoardForm: {
        dashBoardName: "",
      },
      rules3: {
        dashBoardName: [
          { required: true, message: "请输入仪表盘的名称", trigger: "blur" },
        ],
      },
      isLoading: false,
      imgUrl: "",
    };
  },
  computed: {
    empty() {
      return true;
    },
    deleteDashBoardText() {
      return `确定删除仪表盘${this.dashBName}吗?`;
    },
    dashBName() {
      return this.$route.params.dashboardName;
    },
  },
  methods: {
    handleClick(name) {
      if (this.dashboardName !== name) {
        this.dashboardName = name;
        this.$router.push(`/admin/dashboard/${name}`);
      } else {
        this.$message.warning("不能重复选择仪表盘");
      }
    },
    addDashBoard() {
      this.addDashBoardVisible = true;
    },
    confirmAddDashBoard() {
      this.$refs.addDashBoard.validate((vaild) => {
        if (vaild) {
          addDashBoardServer(this.addDashBoardForm)
            .then((res) => {
              if (res.data) {
                this.getDashBoardData();
                this.addDashBoardVisible = false;
                this.$message.success("添加成功");
                this.$router.push(
                  `/admin/dashboard/${this.addDashBoardForm.dashBoardName}`
                );
              } else {
                this.addDashBoardVisible = false;
                this.$message.error("添加失败");
              }
            })
            .catch(() => {
              this.$message.error("请求超时");
            });
        } else {
          return false;
        }
      });
    },
    addComponent() {
      this.addComponentVisible = true;
    },
    confirmAddComponent() {
      this.$refs.addComponent.validate((vaild) => {
        if (vaild) {
          const obj = {
            dashBoardID: [this.addComponentForm.dashBoardId],
            componentName: [this.addComponentForm.componentName],
            tableName: [],
            name: [],
            contentArr: [],
            currentChart: [0],
            file: [],
            fileX: [],
            fileY: [],
          };
          addDashServer(obj)
            .then((res) => {
              if (res.data) {
                this.addComponentVisible = false;
                const name = this.getDashBoardName(obj.dashBoardID[0]);
                this.$router.push(`/admin/dashboard/${name}`);
                this.$message.success("添加成功");
              } else {
                this.$message.error("添加失败");
              }
            })
            .catch(() => {
              this.$message.error("请求超时");
            });
        } else {
          return false;
        }
      });
    },
    updateCurrentDashBoard() {
      this.updateDashBoardForm.dashBoardName = this.dashboardName;
      this.updateDashBoardVisible = true;
    },
    confirmUpdateDashBoard() {
      this.$refs.updateDashBoard.validate((vaild) => {
        if (vaild) {
          const obj = {
            dash_id: this.getDashBoardId(),
            newDashName: this.updateDashBoardForm.dashBoardName,
          };
          updateDashBoardServer(obj)
            .then((res) => {
              if (res.data) {
                this.getDashBoardData();
                this.updateDashBoardVisible = false;
                this.$message.success("修改成功");
                this.$router.push(`/admin/dashboard/${obj.newDashName}`);
              } else {
                this.$message.error("修改失败");
              }
            })
            .catch(() => {
              this.$message.error("请求超时");
            });
        } else {
          return false;
        }
      });
    },
    confirmDeleteDashBoard() {
      const id = this.getDashBoardId();
      deleteDashBoardServer(id)
        .then((res) => {
          if (res.data) {
            this.getDashBoardData();
            this.$message.success("删除成功");
            this.$router.push("/admin/dashboard");
          } else {
            this.$message.error("删除失败, 请检查该仪表盘下是否还存在仪表");
          }
        })
        .catch(() => {
          this.$message.error("请求超时");
        });
    },
    loading() {
      this.isLoading = true;
    },
    endLoading() {
      this.isLoading = false;
    },
    screenshot() {
      // 获取要转换的元素
      const imgDom = this.$refs.content;
      html2canvas(imgDom).then((canvas) => {
        // toDataURL函数生成img标签的可用数据  图片格式转成 base64
        this.imgUrl = canvas.toDataURL("image/png");
      });
      this.$message.info("导出中...");
      setTimeout(() => {
        this.downloadImg();
      }, 500);
    },
    downloadImg() {
      let a = document.createElement("a"); // 生成一个a元素
      let event = new MouseEvent("click"); //创建一个单击事件
      a.download = "SuperCodeMonkey"; // 设置图片名称
      if (this.imgUrl !== "") {
        a.href = this.imgUrl;
      } else {
        this.$message.error("请求错误, 请再次导出图片");
        return;
      }
      a.dispatchEvent(event); //触发a的点击事件
      this.$message.success("导出成功!");
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
  align-items: center;
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
.screenshot {
  font-size: 22px;
  margin-right: 30px;
}
.screenshot:hover {
  cursor: pointer;
}
.header-two {
  display: flex;
  align-items: center;
}
</style>
