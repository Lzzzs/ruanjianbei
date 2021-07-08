<template>
  <el-dialog
    title="计算字段"
    :visible.sync="dialogVisible"
    width="70%"
    top="50px"
    :close-on-click-modal="false"
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
            @click.native="fieldClick(item)"
          >
            {{ item.column_name }}
          </field-item>
        </ul>

        <!-- 内容区域 -->
        <div id="content">
          <div class="content-header">
            <ul>
              <li
                v-for="(item, index) in arr"
                :key="index"
                @click="computerClick(item)"
              >
                {{ item }}
              </li>
            </ul>
            <el-button type="primary" size="mini" @click="clearField"
              >清除所有字段</el-button
            >
          </div>
          <div class="content-body">
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
      typeArr: [], // 与内容相对于的类型数组
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
    contentArr(a) {
      console.log(a);
    }
  },
  methods: {
    fieldClick({ column_name, data_type }) {
      this.contentArr.push(column_name);
      this.typeArr.push(data_type);
    },
    computerClick(name) {
      // + - * /
      this.contentArr.push(name);
      this.typeArr.push(name);
    },
    doubleClick(index) {
      this.contentArr.splice(index, 1);
      this.typeArr.splice(index, 1);
    },
    createField() {
      if (this.formatRule(this.contentArr)) {
        if (this.typeRule(this.typeArr)) {
          this.dialogVisible = false;
          this.clearField();
          this.$message.success("创建成功");
        } else {
          this.$message.warning('类型错误,( - * / ) 运算符只能用在数字类型字段上')
        }
      } else {
        this.$message.warning("格式错误, 请检查格式之后重新创建");
      }
    },
    // 格式限制
    formatRule(arr) {
      // 长度为偶数则格式错误
      if (arr.length % 2 === 0) {
        return false;
      }
      for (let i = 0; i < arr.length; i++) {
        if (
          i % 2 === 0 &&
          (arr[i] == "+" || arr[i] == "-" || arr[i] == "*" || arr[i] == "/")
        ) {
          // 偶数 0, 2, 4  但作为索引为奇数 奇数必须为字段
          return false;
        }

        //  作为索引为偶数 偶数必须运算符
        if (i % 2 !== 0) {
          switch (arr[i]) {
            case "+":
            case "-":
            case "*":
            case "/":
              break;
            default:
              return false;
          }
        }
      }
      return true;
    },
    // 类型限制
    typeRule(arr) {
      for(let i =0 ; i < arr.length; i++) {
        // 如果运算符 有 -, * , /
        if(i % 2 != 0 && (arr[i] === '-' || arr[i] === '*' || arr[i] === '/')) {
          // 如果有int类型 则返回false
          return arr.indexOf('varchar') === -1
        }
      }
      return true
    },
    clearField() {
      // 清空数组
      this.contentArr.splice(0, this.contentArr.length);
      this.typeArr.splice(0, this.typeArr.length);
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
#content > .content-header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #cedae0;
}
#content > .content-header > ul {
  display: flex;
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
#content > .content-body {
  display: flex;
  flex-wrap: wrap;
  padding: 5px;
}
</style>