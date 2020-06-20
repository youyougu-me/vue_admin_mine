<template>
  <!-- 这个占满所有屏幕 -->
  <div id="main-wrap">
    <!-- 主体区域 -->
    <div class="main-content">
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
//满屏
#main-wrap {
  width: 100%;
  height: 100vh;
  //这颜色就是边上的银色
  background-color: #f0f2f5;
  //内容容器根据侧边栏收缩状态值 宽度发生改变
  //这个就是银色里面的白色
  .main-content {
    width: 100%;
    height: 100%;
    padding-top: $layoutHeader + 20px;
    padding-left: $navMenu + 20px;
    padding-right: 20px;
    padding-bottom: 20px;
    @include webkit(box-sizing, border-box);
    @include webkit(transition, all 0.3s ease 0s);
    // 内容
    //这个是白色里面的白色
    .content {
      width: 100%;
      height: 100%;
      padding: 20px 20px 0 20px;
      background-color: #fff;
      @include webkit(box-sizing, border-box);
      overflow:auto;
    }
  }
}

// open close代表仅次于app的容器
//控制主体内容根据侧边栏状态
.open {
  .main-content {
    padding-left: $navMenu + 20;
  }
}
.close {
  //不知道哪里变了,两级不生效,增加了一层权重
  #main-wrap {
    .main-content {
      padding-left: $navMenuMin + 20;
    }
  }
}
</style>