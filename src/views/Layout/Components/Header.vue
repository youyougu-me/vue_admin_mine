<template>
  <div id="header-wrap">
    <div class="pull-left" @click="navMenuState">
      <!-- 这两个值是传给内部组件用的 -->
      <svg-icon iconClass="menu" class="menu" />
    </div>
    <div class="pull-right">
      <img src="../../../assets/images/face.jpg" alt />
      <span class="username">{{username}}</span>
      <div @click="exit" class="exiticon">
        <svg-icon iconClass="exit" class="exit" />
      </div>
    </div>
  </div>
</template>

<script>
import {
  reactive,
  ref,
  isRef,
  onMounted,
  computed
} from "@vue/composition-api";
export default {
  name: "layoutHeader",
  setup(props, { root }) {
    const username = computed(() => root.$store.state.login.username);
    //为什么收缩
    //通过点击侧边栏状态图标,改变侧边栏的状态值
    //通过侧边栏收缩的状态值,动态计算那三部分的宽度
    const navMenuState = () => {
      root.$store.commit("login/SET_COLLAPSE");
    };

    //退出功能
    //清除token,跳转页面
    const exit = () => {
      root.$store
        .dispatch("login/exit")
        .then(() => {
          root.$router.push({
            name: "Login"
          });
        })
        .catch(() => {
          console.log("reject执行了");
        });
    };
    return {
      navMenuState,
      username,
      exit
    };
  }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/config.scss";
#header-wrap {
  z-index: 1;
  position: fixed;
  top: 0;
  right: 0;
  left: $navMenu;
  height: $layoutHeader;
  background-color: $mainCcolor2;
  line-height: $layoutHeader;
  // @include webkit(box-shadow, 0 3px 16px 0 rgba(0, 0, 0, 0.1));
  @include webkit(transition, all 0.3s ease 0s);
  //左边
  .pull-left {
    padding-left: 20px;
    svg {
      font-size: 25px;
      cursor: pointer;
      //垂直居中
      vertical-align:middle;
    }
  }
  //右边
  .pull-right {
    img {
      width: 36px;
      height: 36px;
      float: left;
      border-radius: 50%;
      margin-top:14px;

    }
    .username {
      float: left;
      margin-left: 5px;
      color: $mainCcolor;
    }
    .exiticon {
      float: left;
      padding: 0 30px;
      margin-left: 30px;
      border-left: 1px solid $mainCcolor;
      svg {
        font-size: 25px;
         vertical-align:middle;
         cursor: pointer;
      }
    }
  }
}

// .open的类是道代表layout
.open {
  #header-wrap {
    left: $navMenu;
  }
}
.close {
  #header-wrap {
    left: $navMenuMin;
  }
}
</style>