<template>
  <div>
    <!-- 记住当前页和页码容量自己会变,写死即可 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-sizes="[5,8,10]"
      :page-size="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="ownTotal"
      background
    ></el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //这个由父亲决定
      ownTotal: 0
    };
  },
  methods: {
    handleSizeChange(val) {
      this.$emit("pageSizeChange", val);
    },
    handleCurrentChange(val) {
      this.$emit("currentPageChange", val);
    }
  },
  created() {},
  props: {
    total: {
      type: Number,
      default: () => {
        return 0;
      }
    }
  },
  mounted() {},
  watch: {
    total(newVal, oldVal) {
      this.ownTotal = newVal;
    }
  }
};
</script>
<style lang="scss" scoped>
//我只负责改变父组件的两个页码参数
//父组件给我传总页数
</style>
