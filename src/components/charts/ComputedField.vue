<template>
  <el-dialog
    title="计算字段"
    :visible.sync="dialogVisible"
    width="70%"
    top="50px"
  >
    <el-form :model="form" label-position="left">
      <el-form-item
        label="字段名称"
        label-width="235px
      "
      >
        <el-input
          v-model="form.name"
          clearable
          placeholder="请输入字段名称"
        ></el-input>
      </el-form-item>
      <div class="body">
        <ul class="field">
          <!-- 字段组件 -->
          <field-item
            v-for="(item, index) in tableFields"
            :key="index"
            :tableFields="tableFields"
            :currentIndex="index"
            :hideDropdownBtn="true"
            @click.native="fieldClick(item.column_name)"
          >
            {{ item.column_name }}
          </field-item>
        </ul>

        <!-- 内容区域 -->
        <div id="content">
          <ul>
            <li
              v-for="(item, index) in arr"
              :key="index"
              @click="computerClick(item)"
            >
              {{ item }}
            </li>
          </ul>
          <div>
            <field
              v-for="(item, index) in contentArr"
              :key="index"
              @doubleClick="doubleClick(index)"
            >
              {{ item }}
            </field>
          </div>
        </div>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="createField">创建字段</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Field from "./Field.vue";
import FieldItem from "./FieldItem.vue";
export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        name: "",
      },
      tableFields: [],
      contentArr: [],
      arr: ["+", "-", "*", "/"],
    };
  },
  components: {
    FieldItem,
    Field,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    visible(newValue) {
      this.dialogVisible = newValue;
    },
    // 通知父组件状态改变了
    dialogVisible(newValue) {
      if (newValue) {
        this.tableFields = this.$store.state.tableFields;
      }
      this.$emit("noticeChange", newValue);
    },
  },
  methods: {
    fieldClick(name) {
      this.contentArr.push(name);
    },
    computerClick(name) {
      this.contentArr.push(name);
    },
    doubleClick(index) {
      this.contentArr.splice(index, 1)
      console.log(contentArr);
    },
    createField() {
      this.dialogVisible = false;
      this.$message.success("创建成功");
    },
  },
};
</script>

<style scoped>
.body {
  display: flex;
  justify-content: space-between;
}
.field {
  width: 220px;
  height: 301px;
  border: 1px solid #e8eaed;
  border-radius: 6px;
  overflow: auto;
}
#content {
  border: 1px solid #e8eaed;
  border-radius: 6px;
  width: 77%;
  height: 300px;
}
#content > ul {
  display: flex;
  border-bottom: 1px solid #cedae0;
}
#content li {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 30px;
  margin: 5px;
}
#content li:hover {
  background-color: #e4edfa;
  border-radius: 5px;
  cursor: pointer;
}
#content > div {
  display: flex;
  flex-wrap: wrap;
  padding: 5px;
}
</style>