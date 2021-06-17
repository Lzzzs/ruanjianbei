<template>
  <div>
    <!-- 数据表 -->
    <div class="shujubiao" v-if="chart === 0">
      <div class="title">数据</div>
      <draggable
        v-model="arr1"
        group="lzs"
        animation="300"
        filter=".forbid"
        @end="end"
        @start="start"
        ghostClass="ghost"
      >
        <transition-group style="display: flex; padding-left: 10px">
          <li
            :class="item.column_name === '请拖入左侧字段' ? 'forbid field' : 'field'"
            v-for="(item, index) in arr1"
            :key="index"
          >
            {{ item.column_name }}
          </li>
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
        >
          <transition-group style="display: flex; padding-left: 10px">
            <li
              :class="item.column_name === '请拖入左侧字段' ? 'forbid field' : 'field'"
              v-for="(item, index) in arr2"
              :key="index"
            >
              {{ item.column_name }}
            </li>
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
        >
          <transition-group style="display: flex; padding-left: 10px">
            <li
              :class="item.column_name === '请拖入左侧字段' ? 'forbid field' : 'field'"
              v-for="(item, index) in arr3"
              :key="index"
            >
              {{ item.column_name }}
            </li>
          </transition-group>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
  data() {
    return {
      arr1: [
        {
          column_name: "请拖入左侧字段",
        },
      ],
      arr2: [
        {
          column_name: "请拖入左侧字段",
        },
      ],
      arr3: [
        {
          column_name: "请拖入左侧字段",
        },
      ],
    };
  },
  components: {
    draggable,
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
  },
  watch: {
    arr1() {
      this.listenData(this.arr1, "setArr1");
    },
    arr2() {
      this.listenData(this.arr2, "setArr2");
    },
    arr3() {
      this.listenData(this.arr3, "setArr3");
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
    listenData(target, mutationName) {
      if (mutationName === "setArr1" || mutationName === "setArr2") {
        // 控制'请拖入左侧字段'的显示
        const el = document.getElementsByClassName("forbid")[0];
        if (target.length > 1) {
          el.setAttribute("id", "hide");
        } else {
          el.removeAttribute("id");
        }
      }
      if (mutationName === "setArr3") {
        // 控制'请拖入左侧字段'的显示
        const el = document.getElementsByClassName("forbid")[1];
        if (target.length > 1) {
          el.setAttribute("id", "hide");
        } else {
          el.removeAttribute("id");
        }
      }
      this.$store.commit(mutationName, target);
    },
    // 从右向左
    start() {
      // 刚开始拖拽高亮显示可拖拽区域
      document.getElementsByClassName("ul-column")[0].classList.add("active");
      if (this.chart != 0) {
        document.getElementsByClassName("x")[0].classList.add("active");
        document.getElementsByClassName("y")[0].classList.add("active");
      }
    },
    end() {
      // 结束时去掉样式
      document
        .getElementsByClassName("ul-column")[0]
        .classList.remove("active");
      if (this.chart != 0) {
        document.getElementsByClassName("x")[0].classList.remove("active");
        document.getElementsByClassName("y")[0].classList.remove("active");
      }
      // 传给父组件做去重
      this.$emit("rightToLeft");
    },
  },
};
</script>

<style scoped>
.shujubiao {
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
.shujubiao.active {
  box-shadow: 0px 0px 6px rgb(49, 139, 241);
}
.title {
  border-right: 1px solid #e8eaed;
  padding: 0px 25px 0px 10px;
  font-size: 12px;
}
.field {
  display: flex;
  padding: 0px 10px;
  font-size: 12px;
  background-color: #e4edfa;
  border-radius: 20px;
  margin-left: 4px;
  height: 22px;
  line-height: 22px;
}
.field:hover {
  cursor: move;
}
.forbid {
  color: #9ea6b2;
  background-color: #fff;
  border-radius: 0;
  margin-left: 0;
}
.forbid:hover {
  cursor: pointer;
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
#hide {
  display: none !important;
}
</style>