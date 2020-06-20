<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{breadList[0]}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{breadList[1]}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="height:30px;"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
  created() {},
  mounted() {},
  props: {
    breadList: {
      type: Array,
      default: []
    }
  }
};
</script>
<style lang="scss" scoped>
</style>