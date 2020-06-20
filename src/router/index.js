import Vue from "vue";
import VueRouter from "vue-router";
import Layout from '@/views/Layout'

Vue.use(VueRouter);
//默认路由
export const defaultRoutes = [
  {
    path: "/",
    redirect: "/console",
    hidden: true
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      name: "登录"
    },
    hidden: true,
    component: () => import("../views/Login/index.vue")
  },
  {
    path: "/register",
    name: "Register",
    meta: {
      name: "注册"
    },
    hidden: true,
    component: () => import("../views/Register/index.vue")
  },
  {
    path: "/console",
    name: "Console",
    redirect: "index",
    meta: {
      name: "控制台",
      icon: 'console'
    },
    component: Layout,
    children: [
      {
        //不加杠就变成二级url
        path: "/index",
        name: "Index",
        meta: {
          name: "首页"
        },
        component: () => import("../views/Console/index.vue")
      }
    ]

  },
  //404页面
  {
    path: "/page404",
    name: "Page404",
    meta: {
      name: "404",
    },
    hidden: true,
    component: () => import("../views/Page404/index.vue")
  },
  //为防止报错,匹配的*号404应该放在动态路由的最后
]

//动态路由
export const asyncRoutes = [

  {
    path: "/info",
    name: "Info",
    redirect: "infoCategory",
    meta: {
      name: "信息管理",
      icon: 'info',
      role: "infoSystem"
    },
    component: Layout,
    children: [
      {
        //不加杠就变成二级url
        path: "/infoCategory",
        name: "InfoCategory",
        meta: {
          name: "信息分类",
        },
        component: () => import("../views/Info/infoCategory.vue")
      },
      {
        path: "/infoList",
        name: "InfoList",
        meta: {
          name: "信息列表",
        },
        component: () => import("../views/Info/infoList.vue")
      },
      {
        path: "/infoDetail",
        name: "InfoDetail",
        hidden: true,
        meta: {
          name: "信息详情",
        },
        component: () => import("../views/Info/infoDetail.vue")
      }
    ]

  },
  //用户管理
  {
    path: "/user",
    name: "User",
    redirect: "userList",
    meta: {
      name: "用户管理",
      icon: "user",
      role: "userSystem"
    },
    component: Layout,
    children: [
      {
        //不加杠就变成二级url
        path: "/userList",
        name: "UserList",
        meta: {
          name: "用户列表",
        },
        component: () => import("../views/User/userList.vue")
      }
    ]

  },
  //*404应该放在动态路由的最后
  {
    path: "*",
    redirect: 'page404',
    //因为你又是一级,但你没图标
    //nibuhiddentrue的话就会报错
    hidden: true,
  }
]

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const router = new VueRouter({
  routes: defaultRoutes
});

export default router;
