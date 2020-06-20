// import Vue from "vue/dist/vue.runtime.common.js"
//上面是3.0搭建项目(runtime模式),默认指向
//在vue.config.js文件中更改,修改alias
import Vue from "vue";
//vue3.0
import VueCompositionApi from "@vue/composition-api";
import App from "./App.vue";
import router from "./router/index";
//挂载路由导航守卫
import "./router/premit"
import store from "./store";
//element没通过插件
//就在这里全局引入的
import ElementUI from 'element-ui';
//全局样式
import 'element-ui/lib/theme-chalk/index.css';
//载入主题更改样式文件
// import '@/styles/element-variables.scss';


//引入全局的图标自定义组件
//因为后面是index.js直接省略
//为什么写在这里,因为我想全局注册
//其实引入子组件也可以挂载children
import "./icons";

//引入权限按钮
import { buttonPermission } from "@/utils/isBtn"

//额charts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts




Vue.use(ElementUI);
// vue3.0
Vue.use(VueCompositionApi);

Vue.config.productionTip = false;

//将引入的按钮权限注册为全局方法
Vue.prototype.btnPerm = buttonPermission

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");


