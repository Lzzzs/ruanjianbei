<template>
  <li :class="isShow ? 'active' : ''" :style="deleteDrop">
    <div style="display: flex; align-items: center;">
      <svg
        class="icon"
        aria-hidden="true"
        style="padding-right: 3px; font-size: 14px"
      >
        <use :xlink:href="showIcon"></use>
      </svg>
      <div class="text">
        <slot />
      </div>
    </div>
    <div id="computed" :class="currentType === 'int' ? 'show' : ''">
      {{ this.tableFields[currentIndex].type }}
    </div>
    <el-dropdown
      class="dropdown"
      size="mini"
      trigger="click"
      @visible-change="getShow"
      placement="bottom"
      :hide-on-click="false"
      @command="handleCommand"
      v-show="!hideDropdownBtn"
    >
      <span class="el-dropdown-link">
        <i class="el-icon-caret-bottom"></i>
      </span>
      <el-dropdown-menu slot="dropdown" style="margin-top: 5px">
        <el-dropdown-item command="computed" v-show="currentType === 'int'">
          <div style="margin-right: 10px">计算</div>
          <el-dropdown placement="right-start" size="mini" trigger="click">
            <span class="el-dropdown-link">
              <i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown" style="margin: 4px">
              <el-dropdown-item @click.native="computedType('求和')"
                >求和</el-dropdown-item
              >
              <el-dropdown-item @click.native="computedType('平均值')"
                >平均值</el-dropdown-item
              >
              <el-dropdown-item @click.native="computedType('最大值')"
                >最大值
              </el-dropdown-item>
              <el-dropdown-item @click.native="computedType('最小值')"
                >最小值</el-dropdown-item
              >
              <el-dropdown-item @click.native="computedType('标准差')"
                >标准差</el-dropdown-item
              >
              <el-dropdown-item @click.native="computedType('方差')"
                >方差</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-dropdown-item>
        <el-dropdown-item command="rename"> 重命名 </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <!-- 重命名对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="renameDialog" :close-on-click-modal="false">
      <el-form :model="renameForm">
        <el-form-item label="字段名" label-width="120px">
          <el-input
            v-model="renameForm.newColumn"
            autocomplete="off"
            placeholder="请输入新的字段名"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="renameDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmRename">确 定</el-button>
      </div>
    </el-dialog>
  </li>
</template>

<script>
import { chongmingm } from "@/service/admin/chartServer.js";
export default {
  data() {
    return {
      isShow: false, //外层菜单
      currentName: "",
      currentComputed: "",
      currentType: "",
      renameDialog: false,
      renameForm: {
        tableName: "",
        oldColumn: this.currentName,
        newColumn: "",
      },
    };
  },
  props: {
    tableFields: {
      type: Array,
      default: [],
    },
    currentIndex: {
      type: Number,
      default: 0,
    },
    // 是否隐藏下拉按钮
    hideDropdownBtn: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.currentName = this.tableFields[this.currentIndex].column_name;
    this.renameForm.tableName = this.$route.query.tableName;
  },
  computed: {
    showIcon() {
      const currentType = this.tableFields[this.currentIndex].data_type;
      if (currentType === "varchar") {
        this.currentType = currentType;
        return "#icon-xingzhuang-wenzi";
      }
      if (currentType === "int") {
        this.currentType = currentType;
        return "#icon-shuzi";
      }
    },
    dialogTitle() {
      return `重命名${this.currentName}`;
    },
    deleteDrop() {
      // 如果不需要下拉菜单 则取消改组件获得焦点之后鼠标变成移动样式
      return this.hideDropdownBtn ? "cursor: pointer" : "";
    },
  },
  methods: {
    getShow(isShow) {
      this.isShow = isShow;
    },
    noticeFather(type) {
      this.$emit("computedType", type);
    },
    // 计算
    computedType(type) {
      const obj = {
        type,
        index: this.currentIndex,
      };
      this.$emit("computedType", obj);
    },
    handleCommand(command) {
      if (command === "rename") {
        this.renameDialog = true;
        this.renameForm.oldColumn = this.currentName;
        this.renameForm.newColumn = this.currentName;
      }
    },
    confirmRename() {
      this.renameDialog = false;
      // 及时更新当前字段名字
      this.currentName = this.renameForm.newColumn;
      const loading = this.$loading({
        lock: true,
        text: "修改中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      // 发送请求修改数据库里的字段
      chongmingm(this.renameForm)
        .then((res) => {
          if (res.data.msg) {
            const { newColumn, oldColumn } = this.renameForm;
            // 修改vuex里面的表格字段
            this.$store.commit("renameField", {
              newColumn,
              oldColumn,
            });
            this.$message.success("修改成功");
          } else {
            this.$message.error("修改失败");
          }
          loading.close();
        })
        .catch(() => {
          loading.close();
          this.$message.error("请求超时");
        });
    },
  },
};
</script>

<style scoped>
li {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  padding: 3px 10px;
  height: 21px;
}
.dropdown {
  display: none;
  padding: 0 1px;
  font-size: 12px;
}
li:hover {
  background-color: #e4edfa;
  cursor: move;
}
li:hover .dropdown,
li.active .dropdown {
  display: block;
  background-color: #e4edfa;
  cursor: pointer;
  margin: 0;
}
li.active {
  background-color: #e4edfa;
}
.el-dropdown-menu__item {
  padding: 2px;
}
.el-dropdown-menu__item:hover {
  cursor: pointer;
}
#computed {
  position: absolute;
  top: 2px;
  right: 30px;
  color: #909399;
  font-size: 12px;
  display: none;
}
.show {
  display: block !important;
}
.text {
  width: 102px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>