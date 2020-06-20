<template>
  <div id="category-container">
    <Breadcrumb :breadList="breadList" />
    <el-button type="danger" @click="firstAdd">添加一级分类</el-button>
    <hr style="margin:20px 0;border:0.5px solid #ccc;" />
    <el-row :gutter="40">
      <!-- 左边===================== -->
      <el-col :span="12">
        <div class="block" style="width:100%;">
          <el-tree
            :data="data"
            node-key="id"
            :default-expand-all="false"
            :expand-on-click-node="false"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span>
                <el-button
                  type="default"
                  size="mini"
                  @click="() => addChild(node, data)"
                  round
                  v-if="!data.parent_id"
                >添加子级</el-button>
                <el-button type="primary" size="mini" @click="() => edit(node,data)" round>编辑</el-button>
                <el-button type="danger" size="mini" @click="() => remove(node, data)" round>删除</el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <!-- 右边======================================== -->
      <el-col :span="12" class="right">
        <div class="title">{{edit_title}}</div>
        <!-- 表单区域 -->
        <el-form label-width="142px" v-model="form" class="form-wrap" ref="form">
          <el-form-item label="一级分类名称" v-if="first_status" prop="first_content">
            <el-input v-model="form.first_content" :disabled="first_disabled"></el-input>
          </el-form-item>
          <el-form-item label="二级分类名称" v-if="second_status" prop="second_content">
            <el-input v-model="form.second_content" :disabled="second_disabled"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="default"
              :loading="submit_loading"
              :disabled="submit_disabled"
              @click="submit"
            >确定</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  GetCategoryAll,
  FirstAdd,
  DeleteCategory,
  FirstEdit,
  AddFirstChild
} from "@/api/info";
import { findIdByName } from "@/utils/toolFunc";
import { confirm } from "@/utils/elefunc";
import Breadcrumb from "@c/Breadcrumb/index";
let id = 1000;
export default {
  inject: ["reload"],
  data() {
    const data = [];
    return {
      //面包屑
      breadList: ["信息管理", "信息分类"],
      //分类展示数据
      data: JSON.parse(JSON.stringify(data)),
      //编辑区域
      edit_title: "一级分类添加",
      form: {
        first_content: "",
        second_content: ""
      },
      first_status: true,
      first_disabled: false,
      second_status: false,
      second_disabled: false,
      //按钮
      submit_loading: false,
      submit_disabled: false,
      //状态标识
      submit_flag: "first_add",
      //用来存当前点击的id
      currentId: ""
    };
  },

  methods: {
    /**
     *编辑一级二级一起
     */
    edit(node, data) {
      //判断编辑的是一级还是二级
      if (data.parent_id == null) {
        //一级
        this.firstEdit(data);
      } else {
        //2级
        this.secondEdit(node, data);
        // console.log(data);
        // console.log(node.parent.data.category_name);
      }
    },

    /**
     *删除(一二级一起)
     */
    remove(node, data) {
      // console.log(data.id);
      const params = {
        content: "你确定删除此条分类吗",
        //这两个id都必须传,这个函数是下面自己封装的
        fn: id => this.deleteCategory(id),
        data: {
          categoryId: data.id
        }
      };
      confirm(params);
    },
    /**
     *添加子集
     */
    addChild(node, data) {
      this.addChildStatus(node, data);
    },
    /**
     *点击提交按钮
     */
    submit() {
      //验证
      if (this.submit_flag == "first_add" || this.submit_flag == "first_edit") {
        if (this.form.first_content == "") {
          this.$message({
            type: "warning",
            message: "请输入内容",
            duration: 600
          });
          return false;
        }
      }

      if (
        this.submit_flag == "first_add_child" ||
        this.submit_flag == "second_edit"
      ) {
        if (this.form.second_content == "") {
          this.$message({
            type: "warning",
            message: "请输入内容",
            duration: 600
          });
          return false;
        }
      }

      //添加一级分类
      if (this.submit_flag == "first_add") {
        //一级分类添加
        let requsetData = {
          categoryName: this.form.first_content
        };
        FirstAdd(requsetData).then(res => {
          this.$message({
            type: "success",
            message: res.data.message,
            duration: 600
          });
          //页面要跳,有空白
          // location.reload();
          //无空白
          // this.getCategoryAll();
          //网上抄的方法
          // this.$refs[formName].resetFields();
          this.reload();
        });
      }
      //编辑一级分类(一二级同一个接口,就一起写了)
      if (
        this.submit_flag == "first_edit" ||
        this.submit_flag == "second_edit"
      ) {
        let requsetData = {
          id: this.currentId,
          categoryName:
            this.submit_flag == "first_edit"
              ? this.form.first_content
              : this.form.second_content
        };
        FirstEdit(requsetData).then(res => {
          this.$message({
            type: "success",
            message: res.data.message,
            duration: 600
          });
          //复原了,包括data里面的数据也全部清空
          this.reload();
        });
      }
      //添加子级
      if (this.submit_flag == "first_add_child") {
        const requsetData = {
          categoryName: this.form.second_content,
          parentId: this.currentId
        };
        AddFirstChild(requsetData).then(res => {
          // console.log(res);
          this.reload();
        });
      }
    },

    //===================================
    /**
     *获取所有信息分类
     */
    getCategoryAll() {
      GetCategoryAll().then(res => {
        // console.log(res.data.data);
        //由于组件需要,要把所有category_name变成label
        const listData = res.data.data;
        findIdByName(listData, "category_name", "label");
        //给data重新赋值渲染
        this.data = listData;
      });
    },
    /**
     *添加一级分类
     */
    firstAdd() {
      //状态
      this.submit_flag = "first_add";
      this.first_status = true;
      this.second_status = false;
      this.first_disabled = false;
      this.second_disabled = true;
      this.submit_loading = false;
      this.submit_disabled = false;
      this.form.first_content = "";
      this.edit_title = "添加一级分类";
    },
    /**
     *编辑一级分类
     */
    firstEdit(data) {
      //状态
      this.submit_flag = "first_edit";
      this.first_status = true;
      this.second_status = false;
      this.first_disabled = false;
      this.second_disabled = true;
      this.submit_loading = false;
      this.submit_disabled = false;
      //赋值
      this.form.first_content = data.category_name;
      this.edit_title = "编辑一级分类";
      this.currentId = data.id;
    },
    /**
     *编辑二级分类
     */
    secondEdit(node, data) {
      //状态
      this.submit_flag = "second_edit";
      this.first_status = true;
      this.second_status = true;
      this.first_disabled = true;
      this.second_disabled = false;
      this.submit_loading = false;
      this.submit_disabled = false;
      //赋值
      this.form.first_content = node.parent.data.category_name;
      this.form.second_content = data.category_name;
      this.edit_title = "编辑二级分类";
      this.currentId = data.id;
    },
    /**
     *删除一二级分类
     */
    deleteCategory(id) {
      DeleteCategory(id).then(res => {
        this.reload();
      });
    },
    /**
     *添加子级
     */
    addChildStatus(node, data) {
      //状态
      this.submit_flag = "first_add_child";
      this.first_status = true;
      this.second_status = true;
      this.first_disabled = true;
      this.second_disabled = false;
      this.submit_loading = false;
      this.submit_disabled = false;
      //赋值
      this.form.first_content = data.category_name;
      this.form.second_content = "";
      this.edit_title = "添加二级分类";
      this.currentId = data.id;
    }
  },
  created() {
    this.getCategoryAll();
  },
  components: {
    Breadcrumb
  }
};
</script>
<style lang="scss">
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}
// =======================

.el-tree {
  .el-tree-node {
    margin-top: 10px;
  }
}
.el-tree-node__expand-icon {
  font-size: 18px;
}
//========================
#category-container {
  .right {
    .title {
      margin-top: 10px;
      background-color: #eee;
      padding: 10px 40px;
    }
    .form-wrap {
      margin-top: 30px;
      width: 100%;
    }
  }
}
</style>