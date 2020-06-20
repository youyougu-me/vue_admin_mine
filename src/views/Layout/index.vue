<template>
  <!-- 这个这个类名的变化决定侧边栏,头部,以及顶部的高度如何变化 -->
  <div id="layout" :class="[menuStatus ? 'close' : 'open']">
    <LayoutHeader @click="heheh" />
    <LayoutMain />
    <LayoutNav />
  </div>
</template>
<script>
import { computed } from "@vue/composition-api";
import LayoutHeader from "./Components/Header";
import LayoutMain from "./Components/Main";
import LayoutNav from "./Components/Nav";
// import { LayoutHeader, LayoutMain, LayoutNav } from './Components'
export default {
  name: "layout",
  components: { LayoutHeader, LayoutMain, LayoutNav },
  setup(props, { root }) {
    //监听侧边栏状态值
    const menuStatus = computed(() => root.$store.state.login.isCollapse);
    //暴露数据

    //测试给页面引入的组件绑定点击事件
    //是绑定不了的
    const heheh = ()=>{
      console.log('hehehheh');
    }
    return {
      menuStatus,
      heheh
    };
  }
};
</script>
<style lang="scss" scoped></style>