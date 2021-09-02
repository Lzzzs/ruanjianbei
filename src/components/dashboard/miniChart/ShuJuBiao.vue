<template>
  <div>
    <div>
      <!-- 展示表格 -->
      <el-table
        :data="tableData"
        stripe
        height="215"
        style="width: 100%; font-size: 12px"
        size="mini"
        v-loading="loading"
        v-show="!isShowTip"
      >
        <el-table-column
          :prop="item"
          :label="item"
          v-for="item in tableField"
          :key="item"
        >
        </el-table-column>
      </el-table>
      <div class="count" v-show="!isShowTip">展示<span>1000</span>条</div>
    </div>
    <div class="tip" v-show="isShowTip">
      仪表暂无图表,请点击编辑进行绘制图表
    </div>
  </div>
</template>

<script>
import { getShuJuBiao } from "@/service/admin/chartServer.js";
export default {
  data() {
    return {
      tableData: [],
      tableField: [],
      loading: false,
      isShowTip: true,
    };
  },
  props: {
    createObj: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      if (this.createObj.fields) {
        // 关闭提示
        this.isShowTip = false;
        // 加载动画
        this.loading = true;
        getShuJuBiao(this.createObj)
          .then((res) => {
            const { data, count } = res.data;
            this.count = count;
            this.tableData = data;
            // 将字段取出
            this.tableField = this.createObj.fields.map((item) => {
              return item.column_name;
            });
            // 关闭提示
            this.isShowTip = false;
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
            this.$message.error("请求超时");
          });
      }
    },
  },
};
</script>

<style scoped>
.count {
  font-size: 12px;
}
.count span {
  color: #409eff;
}
.tip {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #909399;
  font-size: 14px;
}
</style>