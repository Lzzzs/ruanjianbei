<template>
  <div>
    <!-- 数据表和饼图 -->
    <div class="shujubiao_bingtu" v-if="judgeChart">
      <div class="title">数据</div>
      <draggable
        v-model="arr1"
        group="lzs"
        animation="300"
        filter=".forbid"
        @end="end"
        @start="start"
        ghostClass="ghost"
        style="width: 100%; height: 30px"
      >
        <transition-group class="group">
          <field-item
            v-for="(item, index) in arr1"
            :key="index"
            :currentIndex="index"
            :tableFields="outputTableFieldArr(arr1)"
            :hideDropdownBtn="true"
            class="field"
          >
            {{ item.column_name }}
          </field-item>
        </transition-group>
      </draggable>
    </div>

    <!-- 其他图表 -->
    <div v-else class="elseChart">
      <div class="x">
        <div class="title">x轴</div>
        <draggable
          v-model="arr2"
          group="lzs"
          animation="300"
          filter=".forbid"
          @end="end"
          @start="start"
          ghostClass="ghost"
          style="width: 100%; height: 30px"
        >
          <transition-group class="group">
            <field-item
              v-for="(item, index) in arr2"
              :key="index"
              :currentIndex="index"
              :tableFields="outputTableFieldArr(arr2)"
              :hideDropdownBtn="true"
              class="field"
            >
              {{ item.column_name }}
            </field-item>
          </transition-group>
        </draggable>
      </div>
      <div class="y">
        <div class="title">y轴</div>
        <draggable
          v-model="arr3"
          group="lzs"
          animation="300"
          filter=".forbid"
          @end="end"
          @start="start"
          ghostClass="ghost"
          style="width: 100%; height: 30px"
        >
          <transition-group class="group">
            <field-item
              v-for="(item, index) in arr3"
              :key="index"
              :currentIndex="index"
              :tableFields="outputTableFieldArr(arr3)"
              :hideDropdownBtn="true"
              class="field"
            >
              {{ item.column_name }}
            </field-item>
          </transition-group>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import FieldItem from "./FieldItem.vue";

export default {
  data() {
    return {
      arr1: [],
      arr2: [],
      arr3: [],
    };
  },
  components: {
    draggable,
    FieldItem,
  },
  props: {
    chart: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    // 监听vux的state中arr1的改变
    listenVuxArr1() {
      return this.$store.state.arr1;
    },
    listenVuxArr2() {
      return this.$store.state.arr2;
    },
    listenVuxArr3() {
      return this.$store.state.arr3;
    },
    judgeChart() {
      // 只有柱形图和饼图返回true 其他返回false
      switch (this.chart) {
        case 0:
        case 1:
          return true;
        default:
          return false;
      }
    },
  },
  watch: {
    arr1() {
      this.$store.commit("setArr1", this.arr1);
    },
    arr2() {
      this.$store.commit("setArr2", this.arr2);
    },
    arr3() {
      this.$store.commit("setArr3", this.arr3);
    },
    listenVuxArr1(newValue) {
      // 如果vux改变,则改组件也改变
      this.arr1 = newValue;
    },
    listenVuxArr2(newValue) {
      // 如果vux改变,则改组件也改变
      this.arr2 = newValue;
    },
    listenVuxArr3(newValue) {
      // 如果vux改变,则改组件也改变
      this.arr3 = newValue;
    },
  },
  methods: {
    // 从右向左
    start() {
      // 刚开始拖拽高亮显示可拖拽区域
      document.getElementsByClassName("ul-column")[0].classList.add("active");
      if (this.chart != 0 && this.chart != 1) {
        document.getElementsByClassName("x")[0].classList.add("active");
        document.getElementsByClassName("y")[0].classList.add("active");
      }
    },
    end() {
      // 结束时去掉样式
      document
        .getElementsByClassName("ul-column")[0]
        .classList.remove("active");
      if (this.chart != 0 && this.chart != 1) {
        document.getElementsByClassName("x")[0].classList.remove("active");
        document.getElementsByClassName("y")[0].classList.remove("active");
      }
      // 传给父组件做去重
      this.$emit("rightToLeft");
    },
    // 输出tableField数组
    outputTableFieldArr(a) {
      let arr = [];
      a.map((i) => {
        arr.push(i);
      });
      return arr;
    },
  },
};
</script>

<style scoped>
.shujubiao_bingtu {
  display: flex;
  font-size: 13px;
  color: #3d4d66;
  background-color: #fff;
  border-radius: 4px;
  height: 30px;
  margin-bottom: 5px;
  align-items: center;
  box-shadow: 0px 0px 3px rgb(49, 139, 241, 0.15);
  transition: box-shadow 0.15s ease-in-out;
}
.shujubiao_bingtu.active {
  box-shadow: 0px 0px 6px rgb(49, 139, 241);
}
.title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 65px;
  height: 30px;
  border-right: 1px solid #e8eaed;
  font-size: 12px;
}
.field {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 170px;
  font-size: 12px;
  background-color: #e4edfa;
  border-radius: 20px;
  margin-left: 4px;
  height: 22px;
  line-height: 22px;
}
.field:hover {
  cursor: move !important;
}
.forbid {
  color: #9ea6b2;
  background-color: #fff;
  border-radius: 0;
  margin-left: 0;
}
.forbid:hover {
  cursor: pointer !important;
}
.elseChart {
  margin-bottom: 15px;
  color: #3d4d66;
  font-size: 12px;
}
.x {
  margin-bottom: 10px;
}
.x,
.y {
  display: flex;
  align-items: center;
  background-color: #fff;
  height: 30px;
  border-radius: 4px;
  color: #3d4d66;
  box-shadow: 0px 0px 3px rgb(49, 139, 241, 0.15);
  transition: box-shadow 0.15s ease-in-out;
}
.x.active,
.y.active {
  box-shadow: 0px 0px 6px rgb(49, 139, 241);
}
.group {
  width: 81%;
  display: flex;
  height: 30px;
  padding-left: 10px;
  position: absolute;
  align-items: center;
}
</style>